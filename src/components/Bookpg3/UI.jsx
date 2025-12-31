import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

/* ---------------- STATE ---------------- */
export const pageAtom = atom(0);

/* ---------------- PAGES ---------------- */
/* File names must exist in public/textures */
export const pages = [
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
  { front: "background6", back: "background6" },
];

/* ---------------- MEMORIES ---------------- */
/* One memory per INNER page */
const memories = [
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  { type: "text", note: "[Your message here]" },
  {
    type: "image",
    src: "/textures/background6",
  },
  { type: "text", note: "[Your message here]" },
];

/* ---------------- UI ---------------- */
export function UI({ onContinue }) {
  const [page, setPage] = useAtom(pageAtom);
  const [currentMemory, setCurrentMemory] = useState(null);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play().catch(() => {});

    if (page === 0) {
      setCurrentMemory({
        type: "text",
        note: "[Instruction message here]",
      });
    } else if (page - 1 < memories.length) {
      setCurrentMemory(memories[page - 1]);
    } else {
      setCurrentMemory(null);
    }
  }, [page]);

  return (
    <main className="fixed inset-0 z-10 pointer-events-none flex justify-center items-end">
      <div className="pointer-events-auto flex flex-col items-center gap-4 p-6">

        {/* MESSAGE / IMAGE */}
        {currentMemory && (
          <div className="max-w-xl bg-black/70 px-6 py-4 rounded-xl backdrop-blur text-center">
            {currentMemory.type === "text" && (
              <p className="text-white text-sm leading-relaxed">
                {currentMemory.note}
              </p>
            )}

            {currentMemory.type === "image" && (
              <img
                src={currentMemory.src}
                alt=""
                className="max-h-60 mx-auto rounded-lg"
              />
            )}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3 flex-wrap justify-center">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-4 py-2 rounded-full border transition ${
                index === page
                  ? "bg-white text-black"
                  : "bg-black/40 text-white"
              }`}
            >
              {index === 0 ? "Cover" : `Page ${index}`}
            </button>
          ))}

          <button
            onClick={() => setPage(pages.length)}
            className={`px-4 py-2 rounded-full border transition ${
              page === pages.length
                ? "bg-white text-black"
                : "bg-black/40 text-white"
            }`}
          >
            Back
          </button>

          {page === pages.length && (
            <button
              onClick={() => {
                if (onContinue) onContinue();
                console.log("Continue clicked");
              }}
              className="px-6 py-2 rounded-full bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-400 transition"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}