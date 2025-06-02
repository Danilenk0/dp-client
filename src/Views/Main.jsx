import React, { useState, useEffect } from "react";
import catImage from "../assets/cat.png";
import cactusImage from "../assets/cactus.png";
import Navbar from "../Components/Navbar";

export default function Main() {
  const [catJump, setCatJump] = useState(false);
  const [cacti, setCacti] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleJump = (e) => {
      if (e.key === " ") {
        setCatJump(true);
        setTimeout(() => setCatJump(false), 500);
      }
    };

    window.addEventListener("keydown", handleJump);
    return () => {
      window.removeEventListener("keydown", handleJump);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        setCacti((prevCacti) => {
          const newCacti = prevCacti.map((cactus) => ({
            ...cactus,
            x: cactus.x - 15,
          }));

          if (newCacti[0]?.x < -50) {
            newCacti.shift();
            setScore((prevScore) => prevScore + 1);
          }

          return newCacti;
        });
      }
    }, 70);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const cactusInterval = setInterval(() => {
      if (!gameOver) {
        setCacti((prevCacti) => [...prevCacti, { x: 600, y: 10 }]);
      }
    }, 2000);

    return () => clearInterval(cactusInterval);
  }, [gameOver]);

  useEffect(() => {
    const collisionCheck = () => {
      cacti.forEach((cactus) => {
        if (cactus.x < 50 && cactus.x > 0 && catJump) {
          setGameOver(true);
        }
      });
    };

    collisionCheck();
  }, [cacti, catJump]);

  const resetGame = () => {
    setCacti([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Счет: {score}</h1>
        <div className="relative w-96 h-64 border-2 border-black bg-sky-300 overflow-hidden">
          <div
            className={`absolute left-12 bottom-0 transition-all duration-500 ${
              catJump ? "bottom-32" : ""
            } w-12 h-12 bg-[url(${catImage})] bg-cover`}
          />
          {cacti.map((cactus, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: cactus.x,
                bottom: 10,
                width: "40px",
                height: "60px",
                backgroundImage: `url(${cactusImage})`,
                backgroundSize: "cover",
              }}
            />
          ))}
        </div>
        {gameOver && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold">Игра окончена!</h2>
            <button
              onClick={resetGame}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Перезапустить
            </button>
          </div>
        )}
      </div>
    </>
  );
}
