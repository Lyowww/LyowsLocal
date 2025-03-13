// components/Game.tsx

"use client";

import Image from "next/image";
import {
  battleJokBtnBg,
  bitget,
  character1,
  dailyRewards,
  gate,
  gifts,
  homeHeader,
  JOK_POINTS,
  profileIconGroup,
  shopImageMap,
  telegramFeaturedGroup,
  tonAirdrop,
  tonAirdropStar,
  wallpaper1,
} from "@/images";
import { useGameStore } from "@/utils/game-mechanics";
import TopInfoSection from "@/components/TopInfoSection";
import { triggerHapticFeedback } from "@/utils/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TASK_PARAMS } from "@/utils/taskUtils";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useHydration } from "@/utils/useHydration";
import { formatTime } from "@/lib/utils";

interface GameProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const AvatarButton = memo(({ onClick }: { onClick: () => void }) => {
  const t = useTranslations("MyJOK");

  return (
    <button
      onClick={onClick}
      className="w-fit absolute bottom-32 left-1/2 transform -translate-x-1/2"
    >
      <Image
        src={battleJokBtnBg}
        alt={""}
        width={243}
        height={53}
        className="min-w-[243px] min-h-[53px]"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col text-center justify-center">
        <p className="font-base uppercase text-nowrap">{t("battle-jok")}</p>
        <p className="text-xs">{t("battle-jok-desc")}</p>
      </div>
    </button>
  );
});

export default function MyJOK({ currentView, setCurrentView }: GameProps) {
  const t = useTranslations("MyJOK");
  const router = useRouter();
  const isHydrated = useHydration();

  //? can be used later for adding animations
  // const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  // useEffect(() => {
  //   const storedAnimation = localStorage.getItem('animationEnabled');
  //   setIsAnimationEnabled(storedAnimation !== 'false');
  // }, []);

  const handleViewChange = (view: string, taskParam?: string) => {
    triggerHapticFeedback(window);
    if (taskParam) {
      router.push(`?view=${view}&task=${taskParam}`);
    } else {
      router.push(`?view=${view}`);
    }
    setCurrentView(view);
  };

  const {
    pointsBalance,
    equippedAvatar,
    equippedWallpaper,
    lastClaimRewardTimestamp,
    lastClaimRewardDay,
  } = useGameStore();

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTimeRemaining = useCallback(() => {
    if (lastClaimRewardDay === 0) return 0;
    const now = new Date();
    const lastClaim = new Date(lastClaimRewardTimestamp);
    const elapsedTime = now.getTime() - lastClaim.getTime();
    return Math.max(0, 86400000 - elapsedTime);
  }, [lastClaimRewardTimestamp, lastClaimRewardDay]);

  useEffect(() => {
    if (isHydrated && lastClaimRewardTimestamp) {
      const updateCountdown = () => {
        const remaining = getTimeRemaining();
        setTimeRemaining(remaining);
        if (remaining === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };

      updateCountdown();
      intervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isHydrated, lastClaimRewardTimestamp, getTimeRemaining]);

  const handleGiveawayClick = () => handleViewChange("giveaway");
  const handleChangeAvatarClick = () => router.push("/games/jok-duel");

  const leftButtons = [
    {
      name: "Bitget",
      link: "",
      btnText: "featured",
      icon: bitget,
      onClick: () => handleViewChange("quests", TASK_PARAMS.BITGET),
    },
    {
      name: "Gate",
      link: "",
      btnText: "featured",
      icon: gate,
      onClick: () => handleViewChange("quests", TASK_PARAMS.GATE),
    },
    {
      name: "TON",
      link: "",
      btnText: "featured",
      icon: telegramFeaturedGroup,
      onClick: () => handleViewChange("quests", TASK_PARAMS.TON),
    },
  ];
  const rightButtons = [
    {
      name: "Big Giveaway",
      link: "",
      btnText: "bigGiveaway",
      icon: gifts,
      onClick: handleGiveawayClick,
    },
    {
      name: "Airdrop",
      link: "",
      btnText: "airdrop",
      icon: tonAirdrop,
      animation: (
        <>
          <Image
            src={tonAirdropStar}
            className="absolute top-0 left-0 w-full h-full z-30 object-cover"
            width={0}
            height={0}
            alt={""}
          />
        </>
      ),
      onClick: () => setCurrentView("airdrop"),
    },
    {
      name: "profile",
      link: "",
      btnText: "profile",
      icon: profileIconGroup,
      onClick: () => setCurrentView("profile"),
    },
  ];

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <TopInfoSection isGamePage={true} setCurrentView={setCurrentView} />

        <div className="flex-grow mt-4 bg-gradient-airdrop-page-header rounded-t-[48px] relative top-glow z-0">
          <div
            className="mt-[3px] bg-[#1d2025] rounded-t-[46px] h-full overflow-y-auto no-scrollbar"
            style={{
              backgroundImage: `url(${
                equippedWallpaper
                  ? shopImageMap[equippedWallpaper].src
                  : wallpaper1.src
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className={
                "absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl flex justify-center"
              }
            >
              <Image
                src={homeHeader}
                width={0}
                height={0}
                sizes={"100vw"}
                alt={"header"}
                className={"w-full px-16"}
              />
              <div className="absolute px-4 flex justify-center">
                <div className="px-4 py-2 flex items-center space-x-2">
                  <Image
                    src={JOK_POINTS}
                    alt="JOK Points"
                    width={48}
                    height={48}
                    className="mx-auto"
                    style={{
                      width: "clamp(2rem, 10vw, 4rem)",
                    }}
                  />
                  <p
                    className="text-6xl text-white"
                    suppressHydrationWarning
                    style={{
                      fontSize: "clamp(2rem, 10vw, 4rem)",
                    }}
                  >
                    {Math.floor(pointsBalance).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-full px-4 pt-1 pb-24 relative overflow-hidden">
              <Image
                src={equippedAvatar ? shopImageMap[equippedAvatar] : character1}
                alt="Main Character"
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                  transform: "scale(0.8) translateY(5%)",
                }}
              />
              <AvatarButton onClick={handleChangeAvatarClick} />

              {/* Left Buttons */}
              {leftButtons.length > 0 && (
                <div className="absolute left-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
                  {leftButtons.map((btn) => (
                    <button
                      key={btn.name}
                      onClick={btn.onClick}
                      className="relative flex flex-col  items-center mb-2"
                    >
                      <Image
                        src={btn.icon}
                        width={82}
                        height={72}
                        alt={btn.name}
                        className=" z-20 "
                      />

                      <p className="absolute bottom-3 w-fit text-[10px] p-1 text-center z-30">
                        {t(btn.btnText)}
                      </p>
                    </button>
                  ))}

                  <button
                    onClick={() => handleViewChange("reward")}
                    className="relative flex flex-col  items-center mb-2"
                  >
                    <Image
                      src={dailyRewards}
                      width={50}
                      height={50}
                      alt={"Daily Rewards"}
                      className="rounded-full z-20 "
                    />

                    <p className="absolute -bottom-5 w-fit text-[10px] p-1 text-center z-30">
                      {timeRemaining !== null && timeRemaining > 0 ? (
                        <span>
                          {isHydrated ? formatTime(timeRemaining) : "--:--:--"}
                        </span>
                      ) : (
                        <span className=" blink-fast">00:00:00</span>
                      )}
                    </p>
                  </button>
                </div>
              )}
              {/* Right Buttons */}
              {rightButtons.length > 0 && (
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
                  {rightButtons.map((btn) => (
                    <button
                      key={btn.name}
                      onClick={btn.onClick}
                      className="relative flex flex-col  items-center mb-2"
                    >
                      {btn.animation && btn.animation}
                      <Image
                        src={btn.icon}
                        width={0}
                        height={0}
                        sizes={"100vw"}
                        alt={btn.name}
                        className="w-[82px] h-[82px] z-20 object-cover"
                      />

                      <p className="absolute bottom-3 w-fit text-[10px] p-1 text-center z-30">
                        {t(btn.btnText)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
