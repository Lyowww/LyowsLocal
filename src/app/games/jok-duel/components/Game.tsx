import {
  energyIcon,
  gameBg,
  gameTimer,
  goldenCup,
  heart,
  heartBg,
  openedBlue,
  openedOrange,
  openedRed,
} from "@/src/app/games/jok-duel/images";
import { BackButton } from "@/src/app/games/jok-duel/components/BackButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FlippingCard } from "./FlippingCard";
import { OpponentComment } from "./OpponentComment";

interface GameProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Game: React.FC<GameProps> = ({ currentView, setCurrentView }) => {
  const [count, setCount] = useState(30);
  const [rotation, setRotation] = useState(0);
  const [opponentComments, setOpponentComments] = useState([
    "I'm going to be unpredictable this time 😈",
    "You won't see this coming! 😏",
    "Let's see if you can handle my next move! 🔥",
    "This round is mine! 💪",
    "I have a surprise strategy for you! 🎭",
    "Get ready for a challenge! 🧩",
    "You might regret your last move... 😈",
    "Checkmate incoming! ♟️",
    "Think you can outsmart me? Prove it! 🤓",
    "You’re walking into my trap! 😜",
  ]);

  const getRandomComment = () => {
    const randomIndex = Math.floor(Math.random() * opponentComments.length);
    return opponentComments[randomIndex];
  };

  useEffect(() => {
    if (count > 0) {
      const interval = setInterval(() => {
        setCount((prev) => prev - 1);
        setRotation((prev) => prev + 12);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [count]);

  const handleBack = () => {
    setCurrentView("");
  };

  // setTimeout(() => {
  //   setCurrentView("win");
  // }, 3000);

  return (
    <div
      className="w-full h-screen p-[20px] flex"
      style={{
        backgroundImage: `url(${gameBg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <BackButton onClick={handleBack} />
      <Image
        src={goldenCup}
        alt="not found"
        className="absolute left-1/2 transform top-[50px] -translate-x-1/2"
      />

      <div className="absolute right-[20px]">
        <Image
          src={energyIcon}
          alt="not found"
          width={30}
          height={30}
          className="absolute z-10"
        />
        <div
          className="w-[100px] h-[20px] rounded-[7px] mt-1 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(to right, #44F756, #D3EB2F, #D684F5, #ADA3D9)",
          }}
        >
          <div className="bg-white border-[#F4D77C] border-[2px] border-r-[3px] w-[90%] h-[14px] rounded-[7px]">
            <div
              className="h-full w-[70px] rounded-[7px]"
              style={{
                background: "linear-gradient(to right, #004989, #004989)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {["left-[30px]", "right-[30px]"].map((position, index) => (
        <div
          key={index}
          className={`absolute ${position} h-[64.32px] w-[56.4px] top-[100px] flex items-center justify-center`}
          style={{ backgroundImage: `url(${heartBg.src})` }}
        >
          <div
            className="h-[28.92px] w-[33px] flex items-end justify-end"
            style={{ backgroundImage: `url(${heart.src})` }}
          ></div>
          <p className="text-[14px] font-extralight absolute top-[30px] right-[7px]">
            x3
          </p>
        </div>
      ))}

      <div className="absolute left-1/2 transform w-[54px] h-[54px] -translate-x-1/2 top-[140px] flex items-center justify-center">
        <Image
          src={gameTimer.src}
          alt="not found"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 1s linear",
          }}
          width={54}
          height={54}
          className="absolute z-0"
        />
        <p className="text-[24px] absolute font-extralight z-10">{count}</p>
      </div>
      <div className="bottom-[40px] absolute flex gap-[20px] left-1/2 -translate-x-1/2">
        <FlippingCard backSrc={openedBlue} position={"first"} canFlip={true} />
        <FlippingCard
          backSrc={openedOrange}
          position={"second"}
          canFlip={true}
        />
        <FlippingCard backSrc={openedRed} position={"third"} canFlip={true} />
      </div>
      <OpponentComment comment={getRandomComment()} />
    </div>
  );
};
