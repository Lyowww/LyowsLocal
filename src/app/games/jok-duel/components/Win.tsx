import { useRef, useState } from "react";
import {
  chestOpening,
  congratsTop,
  jokDuelOnboardingBtnBg,
  rewardsBg,
  stars,
} from "../images";
import Image from "next/image";

interface WinProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Win = ({ currentView, setCurrentView }: WinProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const handleOpenChest = () => {
    setIsPlaying(true);
    setShowGift(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
    setTimeout(() => {
      setShowGift(true);
    }, 4000);
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
        playsInline
      >
        <source src={chestOpening} type="video/mp4" />
      </video>
      <div className="relative z-50">
        <div
          className="w-full h-[100px] rounded-[31px] pt-1"
          style={{
            background:
              "linear-gradient(to right, #44F756, #D3EB2F, #D684F5, #ADA3D9)",
          }}
        >
          <div className="bg-[#000314] h-full w-full rounded-t-[31px]"></div>
        </div>
        <div>
          <Image
            src={congratsTop}
            alt="not found"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <h1 className="absolute left-1/2 -translate-x-1/2 top-[75%] font-extralight text-[22.83px]">
            Congrats
          </h1>
        </div>
        {showGift && (
          <div>
            <Image
              src={rewardsBg}
              alt="not found"
              className="absolute z-0 tranform left-1/2 -translate-x-1/2 top-[180%]"
            />
            <h1 className="absolute z-20 text-[20px] font-extralight tranform left-1/2 -translate-x-1/2 top-[190%] whitespace-nowrap">
              You earn 5 stars
            </h1>
            <Image
              src={stars}
              className="absolute z-20 font-extralight tranform left-1/2 -translate-x-1/2 top-[220%]"
              alt="not found"
            />
          </div>
        )}
      </div>
      <div onClick={handleOpenChest} className="h-full w-full">
        <Image
          className="absolute bottom-[10%]  transform left-1/2 -translate-x-1/2 "
          src={jokDuelOnboardingBtnBg}
          alt="not found"
        />
        <h1 className="absolute bottom-[11.2%] text-[20px] transform left-1/2 -translate-x-1/2 ">
          Open Chest
        </h1>
      </div>
    </div>
  );
};
