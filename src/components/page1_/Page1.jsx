import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TextCursor from "../TextCursor";
import "./Page1.css";

export default function Page1({ onNext }) {
  const thanksRef = useRef(null);
  const peelref = useRef(null);

  useGSAP(() => {
    if (!thanksRef.current) return;

    gsap.from(thanksRef.current.children, {
      opacity: 0,
      y: 80,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all",
    });
  }, []);

  const handleClick = () => {
    const tl = gsap.timeline();
    tl.to(peelref.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0 0%)",
      duration: 0.7,
      ease: "power4.inOut",
    });
    tl.add(onNext);
  };

  return (
    <div className="app-root">
      {/* Cursor effect */}
      <TextCursor text="✨" spacing={100} maxPoints={5} size="text-lg" />

      {/* Background image */}
      <div className="image-bg">
        <img
          src="[background-image]"
          alt="background"
          className="bg-image"
        />
      </div>

      {/* Floating hearts */}
      <div className="hearts-bg">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="app">
        <section className="thanks" ref={thanksRef}>
          <div className="hero-content">
            <h1 id="thanks-text">
              [Your main heading here]
              <span className="highligte"> [Name]</span>
            </h1>

            <p>[Your message here]</p>

            <div className="decor-wrapper">
              <img
                src="[decor-image]"
                alt="decor"
                className="decor-img"
              />
            </div>
          </div>

          <section className="teaser">
            <h2 id="teaserHeading">[Secondary heading here]</h2>

            <p className="teaser-hint">
              [Short hint or description here]
            </p>

            <img
              src="[sticker-image]"
              alt="sticker"
              className="teaser-sticker"
            />
          </section>

          <button
            ref={peelref}
            onClick={handleClick}
            className="
              mt-9 px-10 py-4 rounded-full
              bg-gradient-to-r from-pink-500 to-pink-400
              text-white text-lg font-semibold
              shadow-lg shadow-pink-500/40
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:shadow-pink-500/60
              active:scale-95
            "
          >
            [Button Text]
          </button>
        </section>
      </div>
    </div>
  );
}
