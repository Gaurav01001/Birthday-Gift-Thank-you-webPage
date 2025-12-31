import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function GlassCard({
  image,
  note,
  position,
  scale,
  isActive,
}) {
  const group = useRef();
  const videoRef = useRef(null);

  const [flipped, setFlipped] = useState(false);
  const targetFlip = useRef(0);

  /* ---------------- IMAGE / VIDEO ---------------- */

  const isVideo = image.endsWith(".mp4");

  const videoTexture = useMemo(() => {
    if (!isVideo) return null;

    const video = document.createElement("video");
    video.src = image;
    video.crossOrigin = "anonymous";
    video.loop = false;
    video.muted = false;
    video.playsInline = true;
    video.preload = "auto";

    videoRef.current = video;

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
  }, [image, isVideo]);

  const imageTexture = !isVideo ? useTexture(image) : null;

  /* ---------------- VIDEO CONTROL ---------------- */

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    if (isActive) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, isVideo]);

  /* ---------------- ANIMATION ---------------- */

  useFrame(() => {
    if (!group.current) return;

    group.current.position.lerp(
      new THREE.Vector3(...position),
      0.08
    );

    group.current.scale.lerp(
      new THREE.Vector3(scale, scale, scale),
      0.08
    );

    group.current.rotation.y +=
      (targetFlip.current - group.current.rotation.y) * 0.12;
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        if (!isActive) return;
        setFlipped((f) => !f);
        targetFlip.current = flipped ? 0 : Math.PI;
      }}
    >
      {/* FRONT FACE */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.6, 3.5]} />
        <meshPhysicalMaterial
          map={isVideo ? videoTexture : imageTexture}
          transparent
          roughness={0.15}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* BACK FACE */}
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3, 4.2]} />
        <meshStandardMaterial color="#f9f6f1" />
      </mesh>

      {/* NOTE (HTML — THIS IS THE IMPORTANT PART) */}
      {flipped && note && (
        <Html
          center
          transform
          distanceFactor={4}
          rotation={[0, Math.PI, 0]}
          position={[0, 0, -0.01]}
        >
          <div className="glass-note">
            {note}
          </div>
        </Html>
      )}
    </group>
  );
}
