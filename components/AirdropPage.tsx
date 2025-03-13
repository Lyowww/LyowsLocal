"use client";

import AirButton from "@/components/ui/airdropButton";
import Angle from "@/icons/Angle";
import {
  AirdropBgGradient,
  AirDropBonus,
  AirdropCheckbox,
  AirdropJok,
  AirdropLevel,
  AirdropNft,
  AirdropTelegram,
  character1_Thumb,
  CountdownBgGradient,
  CountdownSmallBg,
  shopImageMap,
} from "@/images";
import { shortText } from "@/lib/utils";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useGameStore } from "@/utils/game-mechanics";
import { triggerHapticFeedback } from "@/utils/ui";
import { useTranslations } from "next-intl";
import { parse } from "date-fns";
import AirdropStartPopup from "@/components/popups/AirdropStartPopup";

enum TabEnum {
  CONDITIONS = "conditions",
  BONUS = "bonus",
  DEFAULT = "",
}

interface AirdropPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

interface TabProps {
  tab: TabEnum;
  onChain?: number;
  jokHolder: boolean;
  isHaveReferral: boolean;
  isUpThirdLevel: boolean;
  holderLevel: number;
}

interface TabBlockItemProps {
  image: string | StaticImport;
  text: string;
  active?: boolean;
}

interface IPlayer {
  player: string;
  won: {
    price: number;
    priceInTon: number;
  };
  profile: string;
}

const TabBlockItem: FC<TabBlockItemProps> = ({
  image,
  text,
  active = false,
}) => (
  <div className={`w-[98px] ${active ? "" : "opacity-40"}`}>
    <Image
      width={0}
      height={0}
      sizes={"100vw"}
      src={image}
      alt={text}
      className="h-[44px] object-cover mx-auto"
    />
    <button className="bg-[#FFFFFF1F] border-[#FFFFFF0F] rounded-[35px] w-full h-[26px] text-[11px] font-medium mt-[7px]">
      {text}
    </button>
  </div>
);

const ConditionsTab: FC<{
  isHaveReferral: boolean;
  isUpThirdLevel: boolean;
}> = ({ isHaveReferral, isUpThirdLevel }) => {
  const t = useTranslations("Airdrop");

  return (
    <div className="flex items-center justify-center gap-[20px]">
      <TabBlockItem
        image={AirdropLevel}
        text={`${t("level")} 3`}
        active={isUpThirdLevel}
      />
      <TabBlockItem
        image={AirdropTelegram}
        text={t("TONCheckIn")}
        active={true}
      />
      <TabBlockItem
        image={AirdropCheckbox}
        text={t("inviteFriends")}
        active={isHaveReferral}
      />
    </div>
  );
};
ConditionsTab.displayName = "ConditionsTab";

const BonusTab: FC<{
  onChain: number;
  jokHolder: boolean;
  holderLevel: number;
}> = ({ onChain, jokHolder, holderLevel }) => {
  const t = useTranslations("Airdrop");

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex gap-[20px] items-center justify-center mt-[20px]">
        <TabBlockItem
          image={AirdropJok}
          text={`${t("JOKHolder")} ${holderLevel}/5`}
          active
        />
        <TabBlockItem
          image={AirdropNft}
          text={`NFT ${onChain}/5`}
          active={jokHolder}
        />
      </div>
      <p className="text-[#FFFFFF] text-sm text-center mt-[25px] mx-auto text-[14px] font-black">
        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-airdrop-text text-[14px] font-black">
          {t("increase")}
        </span>{" "}
        {t("increaseChances")}
      </p>
    </div>
  );
};
BonusTab.displayName = "BonusTab";

const DefaultTab: FC = () => {
  const t = useTranslations("Airdrop");

  return (
    <p className="font-medium text-base text-center text-[#EBEEF5] mx-auto max-w-[256px]">
      {t("rewards")}
    </p>
  );
};

DefaultTab.displayName = "DefaultTab";

const Tabs: FC<TabProps> = ({
  tab,
  onChain,
  jokHolder,
  isHaveReferral,
  isUpThirdLevel,
  holderLevel,
}) => {
  switch (tab) {
    case TabEnum.CONDITIONS:
      return (
        <ConditionsTab
          isHaveReferral={isHaveReferral}
          isUpThirdLevel={isUpThirdLevel}
        />
      );
    case TabEnum.BONUS:
      return (
        <BonusTab
          onChain={onChain!}
          jokHolder={jokHolder}
          holderLevel={holderLevel}
        />
      );
    default:
      return <DefaultTab />;
  }
};

const TableRow: FC<IPlayer & { isLast?: boolean; index?: number }> = ({
  player,
  profile,
  won,
  index,
}) => {
  return (
    <tr className="text-xs font-medium hover:bg-[#FFAF0445]">
      <td
        className={`text-center pl-[11px] border-l border-bl border-[#FFFFFF6E]`}
      ></td>
      <td
        className={`pl-[5px] pr-[10px] py-[5px] text-center border-r border-t border-[#FFFFFF6E]`}
      >
        {index}
      </td>
      <td className="py-[5px] text-center border-r border-t border-[#FFFFFF6E]">
        {shortText({ text: player })}
      </td>
      <td className="py-[5px] text-center text-[10px] border-r border-t border-[#FFFFFF6E]">
        <span className="text-[#31C909] text-xs font-semibold">
          ${won.price}
        </span>{" "}
        ({won.priceInTon} TON)
      </td>
      <td className={`py-[5px] text-center border-t border-[#FFFFFF6E]`}>
        <Image
          width={21}
          height={21}
          src={profile ? shopImageMap[`${profile}_Thumb`] : character1_Thumb}
          alt=""
          className="mx-auto rounded-full"
        />
      </td>
      <td
        className={`text-center pl-[11px] border-r border-br border-[#FFFFFF6E]`}
      ></td>
    </tr>
  );
};

const AirdropPage: React.FC<AirdropPageProps> = ({
  currentView,
  setCurrentView,
}) => {
  const t = useTranslations("Airdrop");

  const [tab, setTab] = useState<TabEnum>(TabEnum.DEFAULT);
  const [players, setPlayers] = useState<IPlayer[] | null>(null);
  const [onChain, setOnChain] = useState<number>(0);
  const [date, setDate] = useState("2025-01-20");
  const [seeMore, setSeeMore] = useState(false);
  // const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [referralCount, setReferralCount] = useState<number>(0);
  const tContent = useTranslations("Airdrop.content");
  const [countDown, setCountDown] = useState<Record<string, string>>({
    Q1: "04/22/25",
    Q2: "06/30/25",
    Q3: "09/30/25",
    Q4: "12/31/25",
  });

  const [formattedCountDown, setFormattedCountDown] = useState<{
    Q1: string;
    Q2: string;
    Q3: string;
    Q4: string;
  }>({
    Q1: "",
    Q2: "",
    Q3: "",
    Q4: "",
  });
  const {
    isHolder,
    userTelegramInitData,
    gameLevelIndex,
    isAirdropRequirementMet,
    holderLevel,
    fakeFriends,
  } = useGameStore();

  const handleViewChange = (view: string) => {
    if (typeof setCurrentView === "function") {
      try {
        triggerHapticFeedback(window);
        setCurrentView(view);
      } catch (error) {
        console.error("Error occurred while changing view:", error);
      }
    } else {
      console.error("setCurrentView is not a function:", setCurrentView);
    }
  };

  const dateFormatter = (date: string, key: string) => {
    const targetDate = parse(date, "MM/dd/yy", new Date());
    const timeDifference = targetDate.getTime() - new Date().getTime();
    let totalSeconds = Math.max(timeDifference / 1000, 0);
    const days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds %= 3600 * 24;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    const seconds = Math.floor(totalSeconds);

    if (key === "Q1") {
      return `${String(days).padStart(2, "0")} DAYS ${String(hours).padStart(
        2,
        "0",
      )} HOURS ${String(minutes).padStart(2, "0")} MINUTES ${String(
        seconds,
      ).padStart(2, "0")} SECONDS`;
    }

    const milliseconds = Math.floor((totalSeconds % 1) * 100);
    return `${String(days).padStart(3, "0")}:${String(hours).padStart(
      2,
      "0",
    )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateCountDown = () => {
      const formatted = Object.keys(countDown).reduce(
        (acc, key) => {
          acc[key] = dateFormatter(countDown[key], key);
          return acc;
        },
        {} as Record<string, string>,
      );

      setFormattedCountDown(
        formatted as { Q1: string; Q2: string; Q3: string; Q4: string },
      );
    };

    updateCountDown();
    const interval = setInterval(updateCountDown, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  useEffect(() => {
    const fetchReferralCount = async () => {
      const res = await fetch(
        `/api/user/referrals?initData=${encodeURIComponent(
          userTelegramInitData,
        )}`,
      );
      const data = await res.json();
      setReferralCount(data.referralCount);
    };
    const fetchOnChainTasks = async () => {
      const res = await fetch(
        `/api/onchain-tasks/count?initData=${encodeURIComponent(
          userTelegramInitData,
        )}`,
      );
      const data = await res.json();
      setOnChain(data.count);
    };

    fetchOnChainTasks();
    fetchReferralCount();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await fetch(
        `/api/airdrops?initData=${encodeURIComponent(
          userTelegramInitData,
        )}&date=${date}`,
      );
      const data = await res.json();
      setPlayers(data.data);
    };
    fetchPlayers();
  }, [date]);

  const handleDateChange = (type: string) => {
    if (date === "2025-01-20" && type === "next") return;
    if (date === "2025-01-20" && type === "prev") return;
    const newDate = dayjs(date)
      .add(type === "prev" ? -1 : 1, "day")
      .format("YYYY-MM-DD");
    setDate(newDate);
  };

  // const handlePopupClose = useCallback(() => {
  //   setIsPopupOpen(false);
  // }, []);

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-gradient-airdrop-page-header rounded-t-[48px] relative top-glow z-0">
          {/* {!isAirdropRequirementMet && (
            <AirdropStartPopup
              isOpen={isPopupOpen}
              onClose={handlePopupClose}
              handleViewChange={handleViewChange}
            />
          )} */}
          <div className="mt-[2px] bg-[#080808] rounded-t-[46px] h-full overflow-y-auto no-scrollbar flex flex-col items-center pb-32 pt-6 px-6">
            <p className={"uppercase text-lg font-bold"}>{t("title")}</p>
            {/* Tabs */}
            <div className="w-full">
              {/* Tab Buttons */}
              <div className={"flex justify-center w-full "}>
                {/* <AirButton
                  onClick={() => {
                    setTab(TabEnum.CONDITIONS);
                  }}
                  imageSrc={MYJOK}
                  className={"mt-4"}
                  active={tab === TabEnum.CONDITIONS}
                >
                  {t("conditions")}
                </AirButton> */}
                <AirButton
                  onClick={() => {
                    setTab((prev) =>
                      prev === TabEnum.BONUS ? TabEnum.DEFAULT : TabEnum.BONUS,
                    );
                  }}
                  imageSrc={AirDropBonus}
                  imgSize={{ width: 55, height: 55 }}
                  className={"mt-4"}
                  active={tab === TabEnum.BONUS}
                >
                  {t("bonus")}
                </AirButton>
              </div>

              {/* Tabs */}
              <div className="flex flex-col justify-center mb-[30px] min-h-[197px]">
                <Tabs
                  tab={tab}
                  onChain={onChain}
                  jokHolder={isHolder}
                  isHaveReferral={referralCount + fakeFriends >= 3}
                  isUpThirdLevel={gameLevelIndex + 1 >= 3}
                  holderLevel={holderLevel}
                />
              </div>
            </div>

            <div>
              {/* <p className="text-[#EBEEF5] text-xs font-medium text-center">
                {t("airdropInfo")}
              </p> */}
              <div className="w-full flex justify-center items-center">
                <a
                  href={"/eligibility-info.html"}
                  target={"_blank"}
                  className="w-[300px] relative pl-[32px] pr-[5px] py-[5px] rounded-[35px] cursor-pointer pointer bg-gradient-button text-white text-xs"
                >
                  <div className="rounded-[35px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#3f3842] w-[calc(100%-3px)] h-[calc(100%-3px)]"></div>
                  <div className="relative z-20 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("checkEligibility")}
                        </span>
                      </div>
                    </div>
                    <div className="w-[54px] h-[54px] bg-[#232224] rounded-full flex justify-center items-center ">
                      <Angle size={40} className="text-white" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="w-[100%] h-[350px] flex flex-col items-center mt-[20px] gap-[20px]">
              <p>{t("comingSoon")}</p>
              <div className="relative w-[100%] h-[60px] flex items-center justify-center blink-fast">
                <Image
                  src={CountdownBgGradient}
                  alt="Not Found"
                  className="absolute inset-0 w-full h-full object-cover "
                />
                <p className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7D7D7D] text-[13px]">
                  {dateFormatter(countDown["Q1"], "Q1")}
                </p>
              </div>
              <p>{t("upcoming")}</p>
              <div className="w-[100%] flex items-center justify-center">
                <p>Q2:</p>
                <div className="relative w-[40%] h-[60px] flex items-center justify-center">
                  <Image
                    src={CountdownSmallBg}
                    alt="Not Found"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <p className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7D7D7D] text-[14px]">
                    {dateFormatter(countDown["Q2"], "Q2")}
                  </p>
                </div>
              </div>
              <div className="w-[100%] flex items-center justify-center">
                <div className="w-[100%] flex items-center justify-center">
                  <p>Q3:</p>
                  <div className="relative w-[100%] h-[60px] flex items-center justify-center">
                    <Image
                      src={CountdownSmallBg}
                      alt="Not Found"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <p className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7D7D7D] text-[14px]">
                      {dateFormatter(countDown["Q3"], "Q3")}
                    </p>
                  </div>
                </div>
                <div className="w-[100%] flex items-center justify-center">
                  <p>Q4:</p>
                  <div className="relative w-[100%] h-[60px] flex items-center justify-center">
                    <Image
                      src={CountdownSmallBg}
                      alt="Not Found"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <p className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7D7D7D] text-[14px]">
                      {dateFormatter(countDown["Q4"], "Q4")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[100%] h-[300px] flex flex-col items-center mt-2 gap-[10px] text-center">
              <p>{tContent("title")}</p>
              <p className="font-extralight">{tContent("description")}</p>
              <p className="font-extralight">{tContent("benefit1")}</p>
              <p className="font-extralight">{tContent("benefit2")}</p>
              <p className="font-extralight">{tContent("benefit3")}</p>
            </div>
            {/* Airdrops */}
            <div className="relative z-10 w-full">
              {/* Header */}
              {/*<div className="w-full flex justify-between items-center mt-[36px]">*/}
              {/*  /!* Left Pagination *!/*/}
              {/*  <button*/}
              {/*    onClick={() => handleDateChange("prev")}*/}
              {/*    className={`bg-[#000000] w-[36px] h-[36px] rounded-full flex justify-center items-center ${*/}
              {/*      date === "2025-01-20" ? "opacity-[30%]" : ""*/}
              {/*    }`}*/}
              {/*  >*/}
              {/*    <Angle size={24} className="rotate-180" />*/}
              {/*  </button>*/}
              {/*  <div className="text-sm sm:text-base font-bold">*/}
              {/*    {t("tableHeading", {*/}
              {/*      count: seeMore*/}
              {/*        ? players?.length*/}
              {/*        : players?.slice(0, 10).length,*/}
              {/*      total: 5000,*/}
              {/*      date: dayjs(date).format("MMMM D, YYYY"),*/}
              {/*    })}*/}
              {/*  </div>*/}
              {/*  <button*/}
              {/*    onClick={() => handleDateChange("next")}*/}
              {/*    className={`bg-[#000000] w-[36px] h-[36px] rounded-full flex justify-center items-center ${*/}
              {/*      date === "2025-01-20" ? "opacity-[30%]" : ""*/}
              {/*    }`}*/}
              {/*  >*/}
              {/*    <Angle size={24} />*/}
              {/*  </button>*/}
              {/*</div>*/}
              <div className="w-full blur-[4px]">
                <table className="w-full mt-[26px] bg-[#00000087] border-separate border-spacing-0 border-[#FFFFFF6E] overflow-hidden rounded-t-[18px] rounded-b-[18px]">
                  {/* Head  */}
                  <thead className="bg-gradient-to-r from-[#E546D89E] via-[#7FC6649E] to-[#BEE1109E] text-xs font-bold">
                    <tr>
                      <th className="text-center pl-[11px] border-l rounded-tl-[18px] border-[#FFFFFF6E]"></th>
                      <th className="pt-[11px] text-center"></th>
                      <th className="pt-[11px] text-center"></th>
                      <th className="pt-[11px] text-center"></th>
                      <th className="pt-[11px] text-center"></th>
                      <th className="text-center pl-[11px] border-r rounded-tr-[18px] border-[#FFFFFF6E]"></th>
                    </tr>
                    <tr>
                      <th className="text-center pl-[11px] border-l border-[#FFFFFF6E]"></th>
                      <th className="pl-[5px] pr-[10px] pt-[3px] text-center border-r border-[#FFFFFF6E]">
                        #
                      </th>
                      <th className="py-[14px] pt-[3px] pb-[7px] text-center border-r border-[#FFFFFF6E]">
                        {t("player")}
                      </th>
                      <th className="py-[14px] pt-[3px] pb-[7px] text-center border-r border-[#FFFFFF6E]">
                        {t("prizeWon")}
                      </th>
                      <th className="py-[14px] pt-[3px] pb-[7px] text-center">
                        {t("profile")}
                      </th>
                      <th className="text-center pl-[11px] border-r border-[#FFFFFF6E]"></th>
                    </tr>
                  </thead>
                  {/* Content */}
                  <tbody className="divide-y divide-[#FFFFFF6E]">
                    {players &&
                      (seeMore
                        ? players.map((player, index) => (
                          <TableRow
                            key={index}
                            {...player}
                            isLast={players.length - 1 === index}
                            index={index + 1}
                          />
                        ))
                        : players
                          ?.slice(0, 10)
                          .map((player, index) => (
                            <TableRow
                              key={index}
                              {...player}
                              isLast={players.length - 1 === index}
                              index={index + 1}
                            />
                          )))}
                    <tr>
                      <td className="text-center pl-[11px] border-l  rounded-bl-[18px] border-[#FFFFFF6E]"></td>
                      <td className="pb-[11px] text-center"></td>
                      <td className="pb-[11px] text-center"></td>
                      <td className="pb-[11px] text-center"></td>
                      <td className="pb-[11px] text-center"></td>
                      <td className="text-center pl-[11px]  border-r rounded-br-[18px] border-[#FFFFFF6E]"></td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-[15px] flex justify-center">
                  <button
                    onClick={() => setSeeMore(!seeMore)}
                    className="mx-auto relative px-[21px] py-[10px] rounded-[35px] cursor-pointer pointer bg-gradient-button text-white text-xs"
                  >
                    <div className="rounded-[35px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black w-[calc(100%-3px)] h-[calc(100%-3px)]"></div>
                    <span className="relative z-40 text-nowrap">
                      {seeMore ? t("seeLess") : t("seeMore")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <Image
              src={AirdropBgGradient}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="absolute w-full left-0 bottom-0 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AirdropPage;
