"use client";

import React, { FC } from "react";
import Angle from "@/icons/Angle";
import Image from "next/image";
import { introBG, JOK_POINTS, sitJoker2 } from "@/images";
import { Earn } from "@/icons/Earn";
import { Prizes } from "@/icons/Prizes";
import { useTranslations } from "next-intl";
import { NEW_USER_BONUS_POINTS, NEW_USER_BONUS_STARS } from "@/utils/consts";

export interface Intro2Props {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Intro2: FC<Intro2Props> = ({ currentView, setCurrentView }) => {
  const t = useTranslations("Intro2");

  const onClick = () => {
    setCurrentView("myjok");
    localStorage.setItem("introEnded", "true");
  };

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-gradient-airdrop-page-header rounded-t-[48px] relative top-glow z-0 h-screen">
          <div className="relative mt-[2px] bg-[#080808] rounded-t-[46px] h-full overflow-hidden no-scrollbar flex flex-col items-center pt-[6px] px-5 pb-28">
            <div
              className="h-[393px] relative z-20 w-full py-[21px] px-[38px] rounded-[32px] flex flex-col items-center"
              style={{
                backgroundImage: `url(${introBG.src})`,
                backgroundSize: "cover",
              }}
            >
              <div className="mt-[12px] flex justify-center items-center gap-1 text-sm font-bold text-center">
                <Earn />
                <p>{t("want")}</p>
              </div>
              <div className="mx-auto max-w-[267px] mt-[34px] flex justify-center items-center gap-1 text-xs font-medium text-center">
                <Prizes />
                <p>{t("increase")}</p>
              </div>
              <p className="max-w-[252px] text-xs font-medium text-center mt-[35px]">
                {t("register")}
              </p>
              <p className="max-w-[252px] text-xs font-normal text-center mt-[35px]">
                {t("start")}
              </p>
              <div className="flex items-center justify-center gap-[3px]">
                <Image src={JOK_POINTS} alt={""} width={48} height={48} />
                <p>{NEW_USER_BONUS_POINTS} +</p>
                <div className="w-max ml-[6px] py-[1.5px] px-[13.5px] gap-[3px] flex justify-center items-center border border-[#238E40] rounded-[20px]">
                  <Image src={"/star.png"} alt={""} width={24} height={24} />
                  <p className="text-sm">{NEW_USER_BONUS_STARS}</p>
                </div>
              </div>
              {/* Button */}
              <div className="flex justify-center mt-[31px]">
                <button className="w-fit" onClick={onClick}>
                  <div className="relative w-full flex justify-center items-center">
                    <div className="w-[163px] relative pl-[32px] pr-[5px] py-[5px] rounded-[35px] cursor-pointer pointer bg-gradient-button text-white text-xs z-50">
                      <div className="rounded-[35px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#151515] w-[calc(100%-3px)] h-[calc(100%-3px)]"></div>
                      <div className="relative z-20 flex justify-between items-center">
                        <div></div>
                        <div className="flex items-center">
                          <span className="font-medium">{t("letsGo")}</span>
                        </div>
                        <div className="w-[30px] h-[30px] bg-[#000000] rounded-full flex justify-center items-center ">
                          <Angle size={40} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="w-[80%] h-[13px] absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E546D8] via-[#A6DA93] to-[#BEE110] blur-[12.8px]"></div>
                  </div>
                </button>
              </div>
            </div>
            <div
              className={
                "h-[calc(100%-420px)] w-full flex justify-center items-start"
              }
            >
              <div className="w-full h-full flex justify-center">
                <Image
                  src={sitJoker2}
                  alt={""}
                  width={0}
                  height={0}
                  sizes={"100vw"}
                  className="h-full w-auto object-contain object-left-top ml-[-6%]"
                />
              </div>
            </div>
            <div
              className="absolute right-0 bottom-0 w-[232px] h-[385px] rotate-[-149.95deg] opacity-[0.48] blur-[214px]"
              style={{
                background:
                  "linear-gradient(to bottom, #4FF852, #CDFF0B, #DE82F8, #AE9FD6)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
