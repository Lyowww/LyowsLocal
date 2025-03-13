import {
  jokDuelOnboardingBg,
  jokDuelOnboardingBtnBg,
  jokDuelOnboardingCard,
  jokDuelOnboardingText,
} from "@/src/app/games/jok-duel/images";
import { BackButton } from "@/src/app/games/jok-duel/components/BackButton";
import { FC } from "react";
import Image from "next/image";

export interface JokDuelOnboardingProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const JokDuelOnboarding: FC<JokDuelOnboardingProps> = ({
  currentView,
  setCurrentView,
}) => {
  const handleBack = () => {
    setCurrentView("");
  };

  const handlePlay = () => {
    setCurrentView("opponent-selection");
  };

  return (
    <div
      className="bg-cover bg-center h-full w-full overflow-y-auto no-scrollbar p-[20px]"
      style={{ backgroundImage: `url(${jokDuelOnboardingBg.src})` }}
    >
      <BackButton onClick={handleBack} />

      <Image
        src={jokDuelOnboardingText}
        alt={""}
        width={jokDuelOnboardingText.width}
        height={jokDuelOnboardingText.height}
        className="mt-[67px] mx-auto"
      />
      <Image
        src={jokDuelOnboardingCard}
        alt={""}
        width={jokDuelOnboardingCard.width}
        height={jokDuelOnboardingCard.height}
        className="mx-auto mt-[70px]"
      />
      <button onClick={handlePlay} className="block mx-auto w-fit relative">
        <Image
          src={jokDuelOnboardingBtnBg}
          alt={""}
          width={jokDuelOnboardingBtnBg.width}
          height={jokDuelOnboardingBtnBg.height}
        />
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Play Now
        </p>
      </button>
    </div>
  );
};
