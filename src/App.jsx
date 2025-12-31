import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";

import Page1 from "./components/page1_/Page1";
import Qna_pg2 from "./components/page2_/Qna_pg2";
import { Experience } from "./components/Bookpg3/Experience";
import { UI } from "./components/Bookpg3/UI";
import Page4 from "./components/Page4_/Page4";
import Closing from "./components/page5/Closing";
import "./App.css";

function App() {
  const [page, setPage] = useState(1);
const isDesktop = window.innerWidth > 800;
  return (
    <>
    
      {/* PAGE 1 */}
      {page === 1 && <Page1 onNext={() => setPage(2)} />}

      {/* PAGE 2 */}
      {page === 2 && <Qna_pg2 onDone={() => setPage(3)} />}

      {/* PAGE 3 (BOOK) */}
      {page === 3 && (
        <>
          <UI onContinue={() => setPage(4)} />
          <Loader />

          <Canvas
  className="book-canvas"
  shadows
  camera={{
    position: [-0.5, 0.8, isDesktop ? 3.6 : 5.5],
    fov: 45,
  }}
          >
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </>
      )}

      {/* PAGE 4 */}
        {page === 4 && <Page4 onEnd={() => setPage(5)} />}
       {page === 5 && <Closing />}

      
    </>
  );
}

export default App;
