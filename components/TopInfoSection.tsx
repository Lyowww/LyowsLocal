// components/TopInfoSection.tsx

"use client";

import { useToast } from "@/contexts/ToastContext";
import Settings from "@/icons/Settings";
import {
  character1_Thumb,
  JOK_POINTS,
  progressBarBg,
  shopImageMap,
} from "@/images";
import { calculateYieldPerHour } from "@/utils/calculations";
import { LEVELS } from "@/utils/consts";
import { useGameStore } from "@/utils/game-mechanics";
import { formatNumber, triggerHapticFeedback } from "@/utils/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface TopInfoSectionProps {
  isGamePage?: boolean;
  setCurrentView: (view: string) => void;
}

export default function TopInfoSection({
  isGamePage = false,
  setCurrentView,
}: TopInfoSectionProps) {
  const t = useTranslations("TopInfoSection");
  const showToast = useToast();

  const {
    userTelegramName,
    gameLevelIndex,
    upgradeYieldPerHour,
    bonusYieldPerHour,
    points,
    equippedAvatar,
  } = useGameStore();

  const handleSettingsClick = () => {
    triggerHapticFeedback(window);
    setCurrentView("settings");
  };

  const handleProfileClick = () => {
    triggerHapticFeedback(window);
    setCurrentView("profile");
  };

  const calculateProgress = () => {
    if (gameLevelIndex >= LEVELS.length - 1) {
      return 100;
    }
    const currentLevelMin = LEVELS[gameLevelIndex].minYieldPerHour;
    const nextLevelMin = LEVELS[gameLevelIndex + 1].minYieldPerHour;
    const yieldPerHour = calculateYieldPerHour(bonusYieldPerHour, upgradeYieldPerHour)
    const progress = ((yieldPerHour - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="px-4 z-10">
      <div className="flex items-center justify-between space-x-4 mt-4">
        <div className="flex items-center w-1/3">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2"
          >
            <div className="flex flex-col justify-center items-center p-1 rounded-lg bg-[#1d2025] relative">
              <div
                className={
                  "overflow-hidden w-[34px] h-[34px] relative rounded-full flex justify-center p-[1px] items-center bg-gradient-to-tr from-[#C27CBC] via-[#D3FF00] to-[#3BE32D]"
                }
              >
                <div className="w-full h-full overflow-hidden rounded-full p-[1px]">
                  <Image
                    src={
                      equippedAvatar
                        ? shopImageMap[`${equippedAvatar}_Thumb`]
                        : shopImageMap[`character${gameLevelIndex + 1}_Thumb`] || character1_Thumb
                    }
                    width={0}
                    height={0}
                    sizes={"100vw"}
                    alt="Small Level Icon"
                    className="rounded-full w-full h-full scale-150 object-cover"
                  />
                </div>
              </div>
              <div className="relative w-full mt-[5px]">
                <Image
                  src={progressBarBg}
                  alt={""}
                  width={0}
                  height={0}
                  sizes={"100vw"}
                  className={"object-contain"}
                />
                <div className="top-0 left-0 absolute z-20 w-full h-full pl-[3px] pr-[3.5px] py-[1px]">
                  <div
                    className="h-full rounded-[1px]"
                    style={{
                      backgroundImage: `linear-gradient(to top, #288500 0%, #37A907 12%, #43C50C 25%, #4CDA10 38%, #51E612 50%, #53EA13 62%, #57EB19 67%, #63EC28 72%, #76EF42 78%, #90F367 85%, #B3F896 92%, #DCFECE 99%, #E4FFD9 100%)`,
                      width: `${calculateProgress()}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-start">
              <p className="text-xs">{userTelegramName}</p>
              <p className="text-[10px] text-[#B4B4B4]">
                Level {gameLevelIndex + 1}
              </p>
            </div>
          </button>
        </div>
        <div
          className={`flex items-center w-fit border-b border-[#43433b] rounded-xl px-4 py-2 bg-gradient-to-bl from-[#FFFFFF1F] to-[#23232321] max-w-64`}
        > 
          <div className="flex-1 text-center">
            <p className="text-xs text-[#85827d] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {t("yieldPerHour")}
            </p>
            <div className="flex items-center justify-center space-x-1">
              <Image src={JOK_POINTS} alt="JOK Points" width={20} height={20} />
              <p className="text-xs">
                +
                {formatNumber(
                  calculateYieldPerHour(bonusYieldPerHour, upgradeYieldPerHour),
                )}
              </p>
            </div>
          </div>
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <div className="flex-1 text-center">
            <p className="text-xs text-[#85827d] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {t("points")}
            </p>
            <div className="flex items-center justify-center space-x-1">
              <Image src={JOK_POINTS} alt="JOK Points" width={20} height={20} />
              <p className="text-xs">{formatNumber(points)}</p>
            </div>
          </div>
          {isGamePage && (
            <>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <button
                onClick={handleSettingsClick}
                className="flex items-center justify-center text-white focus:outline-none"
              >
                <Settings className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
