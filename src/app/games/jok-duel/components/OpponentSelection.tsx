import { FC, useEffect, useMemo } from "react";
import {
  jokDuelOpponentSelectionBg,
  jokDuelOpponentSelectionCardBg,
  jokDuelOpponentSelectionCards,
} from "@/src/app/games/jok-duel/images";
import { BackButton } from "@/src/app/games/jok-duel/components/BackButton";
import Image from "next/image";
import { useGameStore } from "@/utils/game-mechanics";
import { character1, shopImageMap } from "@/images";

export interface OpponentSelectionProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const OpponentSelection: FC<OpponentSelectionProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { equippedAvatar, userTelegramName } = useGameStore();

  console.log(userTelegramName);

  const handleBack = () => {
    setCurrentView("onboarding");
  };

  const avatar = useMemo(
    () => shopImageMap[equippedAvatar] || character1,
    [equippedAvatar]
  );

  setTimeout(() => {
    setCurrentView("selectedOpponent");
  }, 3000);

  return (
    <div
      className="bg-cover bg-center h-full w-full overflow-y-auto no-scrollbar p-[20px]"
      style={{ backgroundImage: `url(${jokDuelOpponentSelectionBg.src})` }}
    >
      <BackButton onClick={handleBack} />
      <div className="h-full mt-[-43px] flex justify-center items-center">
        <div className="relative w-fit">
          <Image
            src={jokDuelOpponentSelectionCardBg}
            alt={""}
            width={jokDuelOpponentSelectionCardBg.width}
            height={jokDuelOpponentSelectionCardBg.height}
          />

          <div
            className={`absolute top-[24px] left-1/2 -translate-x-1/2`}
            style={{
              width: jokDuelOpponentSelectionCardBg.width - 12,
            }}
          >
            <div className="w-full text-2xl text-center flex justify-center items-center">
              <p>Hi {userTelegramName}</p>
              <p className="translate-y-[-7px]">🔥</p>
            </div>
            <div className="mt-[10px] flex justify-center items-center">
              <Image src={avatar} alt={""} className="w-1/2 aspect-square" />
            </div>
            <p className="text-center mt-[32px] font-extralight">
              Searching for available players
            </p>

            <div className="mt-[18px] flex justify-center items-center">
              <div className="spinner">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            </div>

            <div className="mt-[5px] flex justify-center items-center">
              <Image
                src={jokDuelOpponentSelectionCards}
                alt={""}
                width={278.32}
                height={172}
                className="ml-[16px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
