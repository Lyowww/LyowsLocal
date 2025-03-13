"use client";

import { useGameStore } from "@/utils/game-mechanics";
import { FC, forwardRef, useCallback, useEffect, useState } from "react";
import {
  bgLevel,
  character1,
  friends,
  JOK_POINTS,
  quests,
  shopImageMap,
  wallpaper1,
} from "@/images";
import Image from "next/image";
import { formatNumber } from "@/utils/ui";
import { useToast } from "@/contexts/ToastContext";
import { Referral } from "@/components/Friends";
import { shortText } from "@/lib/utils";
import { createPortal } from "react-dom";

export interface PassportPopupProps {
  isOpen: boolean;
  onChainCount: number;
  onClose: () => void;
}

export const LineIcon: FC<{ className?: string }> = ({ className }) => (
  <Image
    src={"/line.png"}
    alt={""}
    width={170}
    height={10}
    className={className}
    loading="eager"
    crossOrigin="anonymous"
  />
);

LineIcon.displayName = "LineIcon";

export const CheckBoxIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="13" cy="13" r="12.5" stroke="url(#paint0_linear_137_613)" />
    <circle cx="13.5" cy="12.5" r="7.5" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 3C18.519 3 23 7.48098 23 13C23 18.519 18.519 23 13 23C7.48098 23 3 18.519 3 13C3 7.48098 7.48098 3 13 3ZM8.63658 12.838L10.9483 14.3795C11.1302 14.5005 11.3702 14.4858 11.5366 14.3439L17.8044 8.97122C17.9985 8.80438 18.2888 8.81659 18.4688 8.99854C18.6488 9.18 18.6576 9.47025 18.4893 9.66293L11.66 17.4678C11.5629 17.5781 11.4215 17.6395 11.2741 17.6337C11.1273 17.6283 10.9907 17.5566 10.9024 17.439L7.97562 13.5366C7.83317 13.3463 7.84829 13.0815 8.0117 12.9088C8.17464 12.7361 8.43853 12.7063 8.63658 12.838Z"
      fill="black"
    />
    <defs>
      <linearGradient
        id="paint0_linear_137_613"
        x1="14.7931"
        y1="28.0526"
        x2="27.134"
        y2="5.95255"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C27CBC" />
        <stop offset="0.619308" stopColor="#D3FF00" />
        <stop offset="1" stopColor="#3BE32D" />
      </linearGradient>
    </defs>
  </svg>
);

const PassportPopup = forwardRef<HTMLDivElement, PassportPopupProps>(
  ({ isOpen, onClose, onChainCount }, ref) => {
    const {
      upgradeYieldPerHour,
      bonusYieldPerHour,
      points,
      gameLevelIndex,
      equippedAvatar,
      equippedWallpaper,
      userTelegramName,
      userTelegramInitData,
      holderLevel,
      fakeFriends
    } = useGameStore();

    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [referralCount, setReferralCount] = useState(0);
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
    const [completedTasksCount, setCompletedTasksCount] = useState(0);
    const showToast = useToast();

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    const calculateYieldPerHour = () => {
      const bonusYield = (bonusYieldPerHour / 100) * upgradeYieldPerHour;
      return upgradeYieldPerHour + bonusYield;
    };

    const fetchReferrals = useCallback(async () => {
      setIsLoadingReferrals(true);
      try {
        const response = await fetch(
          `/api/user/referrals?initData=${encodeURIComponent(userTelegramInitData)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch referrals");
        }
        const data = await response.json();
        setReferrals(data.referrals);
        setReferralCount(data.referralCount);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        showToast(
          "Failed to fetch referrals. Please try again later.",
          "error",
        );
      } finally {
        setIsLoadingReferrals(false);
      }
    }, [userTelegramInitData, showToast]);

    const fetchCompletedTasksCount = useCallback(async () => {
      setIsLoadingReferrals(true);
      try {
        const response = await fetch(
          `/api/tasks/completed/count?initData=${encodeURIComponent(userTelegramInitData)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch referrals");
        }
        const data = await response.json();
        setCompletedTasksCount(data.count);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        showToast(
          "Failed to fetch referrals. Please try again later.",
          "error",
        );
      } finally {
        setIsLoadingReferrals(false);
      }
    }, [userTelegramInitData, showToast]);

    useEffect(() => {
      fetchReferrals();
    }, [fetchReferrals]);

    useEffect(() => {
      fetchCompletedTasksCount();
    }, [fetchReferrals]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            handleClose();
          }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }
    }, [isOpen]);

    return createPortal(
      <div
        className={`fixed top-0 left-0 w-full h-screen ${isOpen ? "bg-[#000000B2] z-50" : "bg-[#00000000] -z-50"} transition-all duration-300`}
        onClick={handleClose}
      >
        <div
          className={`h-max pt-[31px] absolute ${isOpen ? "top-1/2 translate-y-[calc(-50%)]" : "-top-full"} z-50 left-1/2 -translate-x-1/2 transform transition-all duration-300`}
        >
          <div
            className={`w-[340px] pb-[19px] bg-[#0E0E0E] rounded-[23.93px]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-[305px] relative rounded-t-[23.93px] rounded-b-[4125.62px] w-full"
              style={{
                backgroundImage: `url(${equippedWallpaper ? shopImageMap[equippedWallpaper].src : wallpaper1.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <Image
                  src={bgLevel}
                  alt={""}
                  width={0}
                  height={0}
                  sizes={"100vw"}
                  loading="eager"
                  crossOrigin="anonymous"
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(-50%_-_3px)] text-base font-extrabold text-nowrap rotate-[-5.05deg] text-white"
                  id={"passport-modal"}
                >
                  {shortText({
                    text: userTelegramName,
                    separator: "..",
                    startLength: 8,
                    endLength: 0,
                  })}{" "}
                  Lvl {gameLevelIndex + 1}
                </div>
              </div>
              <div className="absolute w-[25px] left-[23px] top-[23px] bg-[#FFFFFF] rounded-[18.98px] px-[7px] py-[9px] text-[#248415] text-xl flex flex-col items-center">
                <span>J</span>
                <span>O</span>
                <span>K</span>
                <span>E</span>
                <span>R</span>
              </div>
              <Image
                src={equippedAvatar ? shopImageMap[equippedAvatar] : character1}
                alt="Main Character"
                width={0}
                height={0}
                sizes={"100vw"}
                className="object-cover object-center mt-auto transform scale-[.9]"
                loading="eager"
                crossOrigin="anonymous"
              />
            </div>
            <div className="mt-[15px] pl-[15px] pr-[11px]">
              <div>
                <p className="font-semibold text-lg text-white text-center">
                  Stats
                </p>
                <LineIcon className={"mt-[4px] mx-auto"} />
                <div className="grid grid-cols-2 gap-[13px] mt-[11px]">
                  <div className="flex items-center col-span-full mx-auto">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={JOK_POINTS}
                        alt="JOK Points"
                        width={28}
                        height={28}
                        loading="eager"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {formatNumber(calculateYieldPerHour())} points per hour
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={friends}
                        alt="JOK Points"
                        width={30}
                        height={30}
                        loading="eager"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {referralCount + fakeFriends} invited Friends
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={quests}
                        alt="JOK Points"
                        width={20}
                        height={20}
                        loading="eager"
                        crossOrigin="anonymous"
                        className="ml-auto"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {completedTasksCount} Quest Completed
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg text-white text-center">
                  Bonus
                </p>
                <LineIcon className={"mt-[4px] mx-auto"} />
                <div className="grid grid-cols-2 gap-[27px] mt-[12px]">
                  <div className="flex items-center gap-[14px]">
                    <CheckBoxIcon />
                    <p className="text-white text-[12px] text-nowrap">
                      JOK Holdeur ({holderLevel}/5)
                    </p>
                  </div>
                  <div className="flex items-center gap-[14px]">
                    <CheckBoxIcon />
                    <p className="text-white text-[12px] text-nowrap">
                      JOK NFT ({onChainCount}/5)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`h-max pt-[31px] ${isOpen ? "hidden" : ""}`} ref={ref}>
          <div
            className={`w-[340px] pb-[19px] bg-[#0E0E0E] rounded-[23.93px]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-[305px] relative rounded-t-[23.93px] rounded-b-[4125.62px] w-full"
              style={{
                backgroundImage: `url(${equippedWallpaper ? shopImageMap[equippedWallpaper].src : wallpaper1.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <Image
                  src={bgLevel}
                  alt={""}
                  width={0}
                  height={0}
                  sizes={"100vw"}
                  loading="eager"
                  crossOrigin="anonymous"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(-50%_-_10px)] text-base font-extrabold text-nowrap rotate-[-5.05deg] text-white">
                  {shortText({
                    text: userTelegramName,
                    separator: "..",
                    startLength: 8,
                    endLength: 0,
                  })}{" "}
                  Lvl {gameLevelIndex + 1}
                </div>
              </div>
              <div className="absolute w-[25px] left-[23px] top-[23px] bg-[#FFFFFF] rounded-[18.98px] px-[7px] py-[9px] text-[#248415] text-xl flex flex-col items-center">
                <span>J</span>
                <span>O</span>
                <span>K</span>
                <span>E</span>
                <span>R</span>
              </div>
              <Image
                src={equippedAvatar ? shopImageMap[equippedAvatar] : character1}
                alt="Main Character"
                width={0}
                height={0}
                sizes={"100vw"}
                className="object-cover object-center mt-auto transform scale-[.9]"
                loading="eager"
                crossOrigin="anonymous"
              />
            </div>
            <div className="mt-[15px] pl-[15px] pr-[11px]">
              <div>
                <p className="font-semibold text-lg text-white text-center">
                  Stats
                </p>
                <LineIcon className={"mt-[4px] mx-auto"} />
                <div className="grid grid-cols-2 gap-[13px] mt-[11px]">
                  <div className="flex items-center">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={JOK_POINTS}
                        alt="JOK Points"
                        width={28}
                        height={28}
                        loading="eager"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {formatNumber(points)} points earned
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={friends}
                        alt="JOK Points"
                        width={30}
                        height={30}
                        loading="eager"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {referralCount + fakeFriends} invited Friends
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={JOK_POINTS}
                        alt="JOK Points"
                        width={28}
                        height={28}
                        loading="eager"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {formatNumber(calculateYieldPerHour())} points per hour
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-[30px] max-w-[30px] w-[30px]">
                      <Image
                        src={quests}
                        alt="JOK Points"
                        width={20}
                        height={20}
                        loading="eager"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-white text-[12px] ml-[7px] text-nowrap">
                      {completedTasksCount} Quest Completed
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg text-white text-center">
                  Bonus
                </p>
                <LineIcon className={"mt-[4px] mx-auto"} />
                <div className="grid grid-cols-2 gap-[27px] mt-[12px]">
                  <div className="flex items-center gap-[14px]">
                    <CheckBoxIcon />
                    <p className="text-white text-[12px] text-nowrap">
                      JOK Holdeur ({holderLevel}/5)
                    </p>
                  </div>
                  <div className="flex items-center gap-[14px]">
                    <CheckBoxIcon />
                    <p className="text-white text-[12px] text-nowrap">
                      JOK NFT ({onChainCount}/5)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.querySelector("#modal")!,
    );
  },
);

PassportPopup.displayName = "PassportPopup";

export default PassportPopup;
