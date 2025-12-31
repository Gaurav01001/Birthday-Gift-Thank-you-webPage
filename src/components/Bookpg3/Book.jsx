import { useCursor, useTexture, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { pageAtom, pages } from "./UI";

const easingFactor = 0.5;
const easingFactorFold = 0.3;
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // portrait
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4));
pageGeometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }), // left edge
  new MeshStandardMaterial({ color: "#111" }),     // spine
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
];

// Preload textures for image pages
pages.forEach((page) => {
  if (page.type === "image") {
    if (page.front) useTexture.preload(`/textures/${page.front}.jpg`);
    if (page.back) useTexture.preload(`/textures/${page.back}.jpg`);
  }
});
useTexture.preload(`/textures/background6.jpg`);

const Page = ({
  number,
  type,
  front,
  back,
  frontText,
  backText,
  stickers,
  page,
  opened,
  bookClosed,
  ...props
}) => {
  const isNote = type === "note";

  const picture = !isNote
    ? useTexture(`/textures/${front}.jpg`, (t) => {
        t.colorSpace = SRGBColorSpace;
      })
    : null;

  const picture2 = !isNote
    ? useTexture(`/textures/${back}.jpg`, (t) => {
        t.colorSpace = SRGBColorSpace;
      })
    : null;

  const pictureRoughness =
    !isNote && (number === 0 || number === pages.length - 1)
      ? useTexture(`/textures/background6.jpg`)
      : null;

  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new Skeleton(bones);

    const paperMaterial = new MeshStandardMaterial({
      color: "#fdfaf4",
      roughness: 0.8,
      metalness: 0,
    });

    const materials = [
      ...pageMaterials,
      // FRONT
      isNote
        ? paperMaterial
        : new MeshStandardMaterial({
            color: whiteColor,
            map: picture,
            roughness: 0.1,
            emissive: emissiveColor,
            emissiveIntensity: 0,
            ...(pictureRoughness && { roughnessMap: pictureRoughness }),
          }),
      // BACK
      isNote
        ? paperMaterial
        : new MeshStandardMaterial({
            color: whiteColor,
            map: picture2,
            roughness: 0.1,
            emissive: emissiveColor,
            emissiveIntensity: 0,
            ...(pictureRoughness && { roughnessMap: pictureRoughness }),
          }),
    ];

    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []); // static materials per page

  const [_, setPage] = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) return;

    const emissiveIntensity = highlighted ? 0.22 : 0;
    // material[4] = front, material[5] = back
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) targetRotation += degToRad(number * 0.8);

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;

      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;

      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  // Helper: HTML overlay content for notes (front/back sides)
  const NoteOverlay = ({ side = "front" }) => {
    const text =
      side === "front" ? frontText : backText;

    const sideOffset = side === "front" ? 0.0016 : -0.0016; // push slightly above/below to avoid z-fighting

    if (!text && !(stickers && stickers.length)) return null;

    return (
      <Html
        transform
        sprite={false}
        occlude
        position={[PAGE_WIDTH / 2, 0, sideOffset]}
        rotation={[0, 0, 0]}
        distanceFactor={1} // keep scale consistent
        style={{
          width: `${PAGE_WIDTH * 300}px`,   // tune DOM width relative to 3D
          height: `${PAGE_HEIGHT * 300}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          fontFamily: "Georgia, serif",
          fontSize: "16px",
          lineHeight: 1.6,
          color: "#222",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {text && <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{text}</p>}
          {stickers?.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="sticker"
              style={{
                position: "absolute",
                width: "64px",
                height: "64px",
                bottom: 12 + i * 8,
                right: 12 + i * 8,
                opacity: 0.95,
                transform: `rotate(${i % 2 ? -8 : 10}deg)`,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </Html>
    );
  };

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />

      {/* Note overlays: render DOM text and stickers on top of paper */}
      {isNote && (
        <>
          <NoteOverlay side="front" />
          <NoteOverlay side="back" />
        </>
      )}
    </group>
  );
};

export const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayed) => {
        if (page === delayed) return delayed;
        timeout = setTimeout(goToPage, Math.abs(page - delayed) > 2 ? 50 : 150);
        if (page > delayed) return delayed + 1;
        if (page < delayed) return delayed - 1;
        return delayed;
      });
    };
    goToPage();
    return () => clearTimeout(timeout);
  }, [page]);

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};