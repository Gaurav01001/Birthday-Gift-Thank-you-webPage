import { useEffect, useState } from "react";
import "./Closing.css";

export default function Closing({ onComplete }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000); // total duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`closing-screen ${show ? "visible" : ""}`}>
      <h1 className="closing-text">
        [Thank you for watching ✨]
        <img src="/textures/background6" alt="Closing visual" />
      </h1>
    </div>
  );
}
