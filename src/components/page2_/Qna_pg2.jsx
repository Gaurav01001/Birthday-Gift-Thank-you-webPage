import React, { useState, useEffect } from "react";
import "./Qna_pg2.css";

const Qna_pg2 = ({ onDone }) => {
  const [currentslides, setcurrentslides] = useState(0);
  const [shownoslide, setshownoslide] = useState(false);
  const [noMoves, setNoMoves] = useState(0);
  const [noPos, setNoPos] = useState({ x: 120, y: 0 });

  const slides = [
    {
      icon: "✨",
      text: "[Announcement message here]",
      type: "announcement",
    },
    {
      icon: "✨",
      text: "[Yes / No question here]",
      type: "question",
    },
    {
      icon: "✨",
      text: "[Final announcement message here]",
      type: "announcement",
    },
  ];

  const handleNoClick = () => {
    if (noMoves < 4) {
      const randomX = Math.random() * 440 - 60;
      const randomY = Math.random() * 60 - 200;

      setNoPos({ x: randomX, y: randomY });
      setNoMoves((prev) => prev + 1);
    } else {
      setshownoslide(true);
    }
  };

  const handleYes = () => setcurrentslides(currentslides + 1);
  const handlegoback = () => setshownoslide(false);

  useEffect(() => {
    setNoMoves(0);
    setNoPos({ x: 120, y: 0 });
  }, [currentslides, shownoslide]);

  const sl = slides[currentslides];

  return (
    <>
      {/* Background */}
      <div className="bg">
        <img
          src="./textures/background6.jpg"
          className="bg-main"
          alt="background"
        />

       
      </div>

      <div className="qna-slides">
        {shownoslide ? (
          <div className="no_slide">
            <img src="[no-slide-image]" alt="illustration" />
            <p>[Message shown after multiple No clicks]</p>
            <button onClick={handlegoback}>[Go back]</button>
          </div>
        ) : (
          <>
            <div className="yes_slides">
              <div>{sl.icon}</div>
              <p>{sl.text}</p>
            </div>

            {sl.type === "question" && (
              <div
                style={{
                  position: "relative",
                  height: "60px",
                  width: "260px",
                  margin: "0 auto",
                }}
              >
                <button
                  style={{ position: "absolute", left: 0 }}
                  onClick={handleYes}
                >
                  [Yes]
                </button>

                <button
                  onClick={handleNoClick}
                  style={{
                    position: "absolute",
                    left: noPos.x,
                    top: noPos.y,
                    transition: "all 0.5s ease-out",
                    cursor: "pointer",
                  }}
                >
                  {noMoves >= 4
                    ? "[Final No button text]"
                    : "[No]"}
                </button>
              </div>
            )}

            {sl.type === "announcement" && (
              <button
                onClick={() => {
                  if (currentslides < slides.length - 1) {
                    setcurrentslides(currentslides + 1);
                  } else {
                    onDone();
                  }
                }}
              >
                Next →
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Qna_pg2;
