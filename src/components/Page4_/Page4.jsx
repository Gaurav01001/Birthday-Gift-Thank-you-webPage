import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import GlassCard from "./GlassCard";

import "./Page4.css";


const images = [
  { image: "/textures/background6.jpg", note: "[Your message here]" },
  { image: "/textures/background6.jpg", note: "[Your message here]" },
  { image: "/textures/background6.jpg", note: "[Your message here]" },
  { image: "/textures/background6.jpg", note: "[Your message here]" },
  { image: "/textures/background6.jpg", note: "[Your message here]" },
  { image: "/textures/background6.jpg", note: "[Your message here ]" },
];
export default function Page4({ onEnd }) {
  const [active, setActive] = useState(2);
  const [mouseX, setMouseX] = useState(0);
  const slideTimeoutRef = useRef(null);
  const lastSlideTimeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position to -1 to 1
      const normalized = (e.clientX / window.innerWidth) * 2 - 1;
      setMouseX(normalized);

      // Clear existing timeout
      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
      }

      // Debounce sliding to prevent rapid changes
      const now = Date.now();
      const timeSinceLastSlide = now - lastSlideTimeRef.current;
      
      // Only slide if enough time has passed (300ms cooldown)
      if (timeSinceLastSlide < 300) return;

      // Set threshold zones for sliding
      const leftThreshold = -0.25;
      const rightThreshold = 0.25;

      slideTimeoutRef.current = setTimeout(() => {
        if (normalized < leftThreshold && active > 0) {
          setActive(prev => Math.max(0, prev - 1));
          lastSlideTimeRef.current = Date.now();
        } else if (normalized > rightThreshold && active < images.length - 1) {
          setActive(prev => Math.min(images.length - 1, prev + 1));
          lastSlideTimeRef.current = Date.now();
        }
      }, 150); // Small delay for smooth feel
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
      }
    };
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActive(prev => Math.max(0, prev - 1));
        lastSlideTimeRef.current = Date.now();
      } else if (e.key === "ArrowRight") {
        setActive(prev => Math.min(images.length - 1, prev + 1));
        lastSlideTimeRef.current = Date.now();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="page4-root">
      
      {/* BACKGROUND IMAGE */}
      <div className="page4-bg">
        <img src="/textures/background6.jpg" alt="background" />
      </div>

      {/* SPARKLES + VIGNETTE */}
      <div className="page4-sparkles" />
      <div className="page4-vignette" />

      {/* NAVIGATION HINT */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px',
        zIndex: 10,
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        Move mouse left/right to navigate • Use arrow keys • {active + 1}/{images.length}
      </div>

      {/* NAVIGATION DOTS */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              lastSlideTimeRef.current = Date.now();
            }}
            style={{
              width: i === active ? '40px' : '12px',
              height: '12px',
              borderRadius: '6px',
              border: 'none',
              background: i === active 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: i === active 
                ? '0 0 20px rgba(255, 255, 255, 0.5)' 
                : 'none'
            }}
          />
        ))}
      </div>

      {/* MOUSE POSITION INDICATOR (for debugging - can be removed) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10
      }}>
        Mouse: {mouseX.toFixed(2)}
      </div>
{/* END BUTTON */}
<div
  style={{
    position: "absolute",
    bottom: "110px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
  }}
>
  <button
    onClick={() => {
    document.body.classList.add("page4-exit");
    setTimeout(onEnd, 900);
  }}
    style={{
      padding: "0.9rem 2.2rem",
      borderRadius: "999px",
      border: "none",
      background:
        "linear-gradient(135deg, #ff8fdc, #b388ff)",
      color: "white",
      fontSize: "15px",
      fontWeight: "500",
      letterSpacing: "0.05em",
      cursor: "pointer",
      boxShadow:
        "0 12px 35px rgba(180,120,255,0.45)",
      transition: "transform 0.25s ease",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.transform = "translateY(-2px)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.transform = "translateY(0)")
    }
  >
    End ✨
  </button>
</div>

      {/* THREE CANVAS */}
      <div className="page4-canvas">
 
    <div className="glass-card-surface" />
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />



          {images.map((item, i) => {
            const offset = i - active;
            return (
              <GlassCard
                key={i}
                image={item.image}
                note={item.note}
                position={[offset * 3, 0, -Math.abs(offset) * 1.2]}
                scale={i === active ? 1.0 : 0.75}
                isActive={i === active}
              />
            );
          })}

          <Environment preset="studio" />
        </Canvas>
        </div>

    </div>
  );
}