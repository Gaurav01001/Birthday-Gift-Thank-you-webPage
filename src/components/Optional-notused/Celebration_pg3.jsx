import React, { useRef,  useEffect } from "react";
import {  } from "gsap";
import HTMLFlipBook from "react-pageflip";
import "./Celebration_pg3.css";


const Celebration_Pg3 = ({ onDone }) => {
  const pageRef = useRef(null);
  const bgRef = useRef(null);
const [currentPage, setCurrentPage] = React.useState(0);



  const memories = [
    {image: "./images/chilguy_1.png",  gif:"./images/nubcat1.gif",  },

  {
    image: "./images/numcat2.gif",
    note: "THIS IS NOT A PROPOSAL. I'M NOT ASKING YOU TO BE MY GF OR ANYTHING 👍 This one is gonna be corny soo just read and forget . This is the best i could come up with .",
  },

  {
    image: "./images/Sohini/pic-4.jpg",
    note: "Sorry for every mistake I made, every wrong thing I said. Sorry for not giving you gifts, sorry for being incapable of providing what you deserved.",
  },

  {
    image: "./images/Sohini/pic-1.jpg",
    note: "You look so freaking hot in these pics, omg! I can’t write sad shit. You are sooo damn beautiful 🤌🤌",
  },

  {
    image: "./images/Sohini/pic-2.jpg",
    note: "Lucky girl. Kinda jealous of her, ngl.",
  },

  {
    image: "./images/Sohini/pic-5.jpg",
    note: "Thank you for always noticing me. Thank you for talking to me. Thank you for being there when I thought I didn’t need anyone.",
  },

  {
    image: "./images/Sohini/pic-6.jpg",
    note: "I think you were the only fish in my sea, and I was incapable of holding onto the fishing rod. (Sounds weird — I don’t wanna eat you for lunch or anything… wish I could.) Idk, Bangali tai fish-er reference ig.",
  },

  {
    image: "./images/Sohini/pic-7.jpg",
    note: "I wish I could be capable enough for you, but I know I don’t deserve you. I’m sorry for being incapable of building a future together. I lost a baddie, I'm gonna regret this my entire life , even if i find someone else , even after 20-30 years i wish i had been capable, worthy enough for you ",
  },

  {
    image: "./images/Sohini/pic-8.jpg",
    note: "Happy Birthday, Soheni. I wish you find the right partner and a great future. I know I’m late, but consider this my last gift, ig… idk.",
  },

  {
    image: "./images/fire.gif",
    note: "I know it was corny as hell, but jo mone chhilo bol diyechi. I’m acting like a class 5 kid, sorry. I don’t even know how to talk to you after you read all this shit — just ignore im gonna delete this shit after you see this idk if i will even show you this . It took me quite an effort okay find a guy who will put same or more amount of effort . I could have made it better thora time lgta so this is the best i could do  cause new year gift ig ",
  },

  {
    image: "./images/Sohini/pic-3.jpg",
    gif: "./Images/pika.gif",
  },
];

useEffect(() => {
  const el = document.querySelector(".page3-content");

  const move = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, []);
  // Background darken on decorate

  return (
    <div className="page3-root" ref={pageRef}>
      {/* Background */}
      <div className="page3-bg" ref={bgRef} />

      {/* Book */}
      <div className="page3-content">
        <div className="book-wrapper">
          <HTMLFlipBook
            width={420}
            height={560}
            size="fixed"
            // showCover={true}
            maxShadowOpacity={0.35}
            flippingTime={1500}
             onFlip={(e) => setCurrentPage(e.data)}
          >
            {memories.map((mem, i) => (
              <div className="page" key={i}>
                <div className="page-content">
                  <img src={mem.image} alt={`memory-${i}`} />
                  { mem.gif ? (
                      <img
                        src={mem.gif}
                        alt="special-memory"
                        className="memory-gif"
                      />
                  ) :
                  (<p>{mem.note}</p>)}
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* UI */}
      {currentPage === memories.length - 1 && (
  <div className="page3-ui">
    <button onClick={onDone}>Continue →</button>
  </div>
)}
    </div>
  );
};

export default Celebration_Pg3;




// import { Canvas } from "@react-three/fiber";
// import { Environment, Float, OrbitControls } from "@react-three/drei";
// import { Book } from "../BOOKS/Book";
// import { UI } from "../BOOKS/UI";

// export default function Celebration_Pg3() {

//   return (
   

//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 5,
//         background: "#ffc0cb", // same pink bg
//       }}
//     >
//       {/* UI overlay */}
//       <UI />

//       {/* 3D Canvas */}
//       <Canvas
//         shadows
//         camera={{ position: [0, 1.5, 4], fov: 45 }}
//         style={{ position: "absolute", inset: 0 }}
//       >
//         <Environment preset="studio" />

//         <Float rotation-x={-Math.PI / 4} floatIntensity={1} speed={2}>
//           <Book />
//         </Float>

//         <directionalLight
//           position={[2, 5, 2]}
//           intensity={2.5}
//           castShadow
//         />

//         <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
//           <planeGeometry args={[100, 100]} />
//           <shadowMaterial transparent opacity={0.2} />
//         </mesh>

//         <OrbitControls enableZoom={false} />
//       </Canvas>
//     </div>
    
//   );
  
// }
