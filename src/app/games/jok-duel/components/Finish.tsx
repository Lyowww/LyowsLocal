import { useState } from "react";
import {
  defeatBg,
  defeatDiamond,
  jokDuelOnboardingBtnBg,
  winningBg,
  winningCountBg,
} from "../images";
import Image from "next/image";
import DieAnimation from "../animations/DieAnimation";

interface FinishProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Finish = ({ currentView, setCurrentView }: FinishProps) => {
  const [win, setWin] = useState(false);
  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage: win ? `url(${winningBg.src})` : `url(${defeatBg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full h-[200px] rounded-t-[31px] rounded-b-[50px] pt-1"
        style={{
          background:
            "linear-gradient(to right, #44F756, #D3EB2F, #D684F5, #ADA3D9)",
        }}
      >
        <div className="w-full h-full bg-[#0E1B2E] rounded-[31px]">
          <Image
            src={defeatDiamond}
            alt="not found"
            className="absolute transform -translate-x-1/2 left-1/2 translate-y-[40%] opacity-[0.5]"
          />
          <h1 className="absolute transform -translate-x-1/2 left-1/2 translate-y-[160%] text-[35px] font-extralight">
            Defeat
          </h1>
          <div
            className="w-[202px] h-[79px] rounded-[67px] absolute -translate-x-1/2 left-1/2 translate-y-[220%] z-0"
            style={{
              backgroundImage: `url(${winningCountBg.src})`,
            }}
          >
            <h1 className="text-[60px] font-extralight absolute -translate-x-1/2 left-1/2 -translate-y-[5%] z-0">
              0/3
            </h1>
          </div>
        </div>
        <DieAnimation isPlaying={true} />
        <div
          className="absolute bottom-[10%] transform left-1/2 -translate-x-1/2"
          onClick={() => setCurrentView("")}
        >
          <Image src={jokDuelOnboardingBtnBg} alt="not found" />
          <h1 className="absolute top-[20%] text-[20px] transform left-1/2 -translate-x-1/2 whitespace-nowrap font-extralight">
            Play Again
          </h1>
        </div>
      </div>
    </div>
  );
};
