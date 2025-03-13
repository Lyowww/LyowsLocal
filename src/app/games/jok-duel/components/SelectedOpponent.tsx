import { FC, useMemo } from "react";
import {
  friends,
  jokDuelOnboardingBg,
  selectedJoker,
  selectedOpponentBG,
  selectedOpponentCardBG,
  selectedOpponentLevel,
} from "@/src/app/games/jok-duel/images";
import Image from "next/image";
import { useGameStore } from "@/utils/game-mechanics";
import { cards, character1, quests, shopImageMap } from "@/images";

export interface SelectedOpponentProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const SelectedOpponent: FC<SelectedOpponentProps> = ({
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
    [equippedAvatar],
  );

  setTimeout(() => {
    setCurrentView("versus");
  }, 3000);

  return (
    <div
      className="bg-cover bg-center h-full w-full overflow-y-auto no-scrollbar p-[20px]"
      style={{ backgroundImage: `url(${jokDuelOnboardingBg.src})` }}
    >
      <div className="h-full mt-[-43px] flex flex-col justify-center items-center">
        <h1 className="text-[20px] mb-8 font-extralight whitespace-nowrap">
          Joker 1 ready to match 😈
        </h1>
        <div
          className="w-[288px] h-[480px] bg-no-repeat bg-center relative "
          style={{ backgroundImage: `url(${selectedOpponentCardBG.src})` }}
        >
          <Image
            src={selectedOpponentLevel}
            alt="Character"
            className="absolute transform left-1/2 -translate-x-1/2 -translate-y-5 z-10"
          />
          <p className="-rotate-[4deg] text-[14px] font-sans absolute transform z-10 left-1/2 -translate-x-1/2">
            {userTelegramName.length > 9
              ? userTelegramName.substring(0, 9) + "..."
              : userTelegramName}{" "}
            Lvl 7
          </p>
          <Image
            src={selectedOpponentBG}
            alt="not found"
            className="absolute transform left-1/2 -translate-x-1/2 translate-y-5 w-[99%] z-0 rounded-t-[20.6px]"
          />
          <p className="flex flex-col font-sans z-100 justify-center items-center absolute left-[20px] top-[30px] w-[25px] h-[full] bg-[#FFFFFF] rounded-[18.98px] px-[7px] py-[9px] text-[#248415] text-[17px]">
            <span>J</span>
            <span>O</span>
            <span>K</span>
            <span>E</span>
            <span>R</span>
          </p>
          <Image
            src={selectedJoker}
            alt="not found"
            className="z-100 absolute left-[35px] top-[35px]"
          />
          <p className="z-100 font-sans absolute left-1/2 -translate-x-1/2 top-[270px] text-[14px]">
            Stats
          </p>
          <svg
            width="147"
            height="10"
            viewBox="0 0 147 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-1/2 -translate-x-1/2 top-[290px]"
          >
            <path
              d="M73.682 0.53125L70.7573 4.8296L73.682 9.12795L76.6068 4.8296L73.682 0.53125Z"
              fill="url(#paint0_linear_1310_1822)"
            />
            <path
              d="M81.5427 3.38769L77.304 4.82959L81.5427 6.27148L146.645 4.82959L81.5427 3.38769Z"
              fill="url(#paint1_linear_1310_1822)"
            />
            <path
              d="M65.5987 6.27148L69.8375 4.82955L65.5987 3.38769L0.496094 4.82955L65.5987 6.27148Z"
              fill="url(#paint2_linear_1310_1822)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1310_1822"
                x1="0.496094"
                y1="4.8296"
                x2="146.645"
                y2="4.8296"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.501664" stop-color="#646464" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1310_1822"
                x1="0.496094"
                y1="4.8296"
                x2="146.645"
                y2="4.8296"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.501664" stop-color="#646464" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1310_1822"
                x1="0.496094"
                y1="4.8296"
                x2="146.645"
                y2="4.8296"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.501664" stop-color="#646464" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute left-1/2 flex justify-center items-center -translate-x-1/2 top-[310px]">
            <Image
              src={cards}
              alt="not found"
              width={29}
              height={29}
              className="object-contain"
            />
            <p className="font-sans text-[11px] ml-[7px] whitespace-nowrap">
              740k points per hour
            </p>
          </div>
          <div className="absolute left-1/2 flex justify-center items-center gap-[30px] -translate-x-1/2 top-[350px]">
            <div className="flex justify-center items-center">
              <Image
                src={friends}
                alt="not found"
                width={29}
                height={29}
                className="object-contain"
              />
              <p className="font-sans text-[11px] ml-[7px] whitespace-nowrap">
                1 invited Friends
              </p>
            </div>
            <div className="flex justify-center items-center">
              <Image
                src={quests}
                alt="not found"
                width={29}
                height={29}
                className="object-contain"
              />
              <p className="font-sans text-[11px] ml-[7px] whitespace-nowrap">
                124 Quest Completed
              </p>
            </div>
          </div>
          <p className="z-100 font-sans absolute left-1/2 -translate-x-1/2 top-[380px] text-[14px]">
            Bonus
          </p>
          <svg
            width="147"
            height="10"
            viewBox="0 0 147 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-1/2 -translate-x-1/2 top-[400px]"
          >
            <path
              d="M73.682 0.53125L70.7573 4.8296L73.682 9.12795L76.6068 4.8296L73.682 0.53125Z"
              fill="url(#paint0_linear_1310_1822)"
            />
            <path
              d="M81.5427 3.38769L77.304 4.82959L81.5427 6.27148L146.645 4.82959L81.5427 3.38769Z"
              fill="url(#paint1_linear_1310_1822)"
            />
            <path
              d="M65.5987 6.27148L69.8375 4.82955L65.5987 3.38769L0.496094 4.82955L65.5987 6.27148Z"
              fill="url(#paint2_linear_1310_1822)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1310_1822"
                x1="0.496094"
                y1="4.8296"
                x2="146.645"
                y2="4.8296"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.501664" stop-color="#646464" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1310_1822"
                x1="0.496094"
                y1="4.8296"
                x2="146.645"
                y2="4.8296"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.501664" stop-color="#646464" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1310_1822"
                x1="0.496094"
                y1="4.8296"
                x2="146.645"
                y2="4.8296"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="0.501664" stop-color="#646464" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex gap-[30px] left-1/2 -translate-x-1/2 top-[420px]">
            <div className="flex justify-center items-center gap-[10px]">
              <svg
                width="24"
                height="23"
                viewBox="0 0 24 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12.0995"
                  cy="11.6933"
                  r="10.759"
                  stroke="url(#paint0_linear_1310_1845)"
                  stroke-width="0.860722"
                />
                <circle cx="12.5374" cy="11.264" r="6.45542" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.0697 2.58594C16.8144 2.58594 20.6667 6.4381 20.6667 11.1826C20.6667 15.9272 16.8144 19.7793 12.0697 19.7793C7.32496 19.7793 3.47266 15.9272 3.47266 11.1826C3.47266 6.4381 7.32496 2.58594 12.0697 2.58594ZM8.31843 11.0434L10.3058 12.3686C10.4622 12.4726 10.6686 12.46 10.8116 12.3379L16.2 7.71921C16.3669 7.57579 16.6164 7.58628 16.7712 7.7427C16.9259 7.8987 16.9335 8.14821 16.7888 8.31385L10.9177 15.0235C10.8342 15.1182 10.7126 15.1711 10.586 15.166C10.4597 15.1614 10.3423 15.0998 10.2664 14.9987L7.7502 11.6439C7.62774 11.4804 7.64074 11.2527 7.78122 11.1042C7.9213 10.9558 8.14817 10.9302 8.31843 11.0434Z"
                  fill="black"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1310_1845"
                    x1="13.6429"
                    y1="24.6494"
                    x2="24.265"
                    y2="5.6274"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#C27CBC" />
                    <stop offset="0.619308" stop-color="#D3FF00" />
                    <stop offset="1" stop-color="#3BE32D" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="font-sans text-[11px] whitespace-nowrap">
                JOK Holdeur (1/5)
              </p>
            </div>
            <div className="flex justify-center items-center gap-[10px]">
              <svg
                width="24"
                height="23"
                viewBox="0 0 24 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12.0995"
                  cy="11.6933"
                  r="10.759"
                  stroke="url(#paint0_linear_1310_1845)"
                  stroke-width="0.860722"
                />
                <circle cx="12.5374" cy="11.264" r="6.45542" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.0697 2.58594C16.8144 2.58594 20.6667 6.4381 20.6667 11.1826C20.6667 15.9272 16.8144 19.7793 12.0697 19.7793C7.32496 19.7793 3.47266 15.9272 3.47266 11.1826C3.47266 6.4381 7.32496 2.58594 12.0697 2.58594ZM8.31843 11.0434L10.3058 12.3686C10.4622 12.4726 10.6686 12.46 10.8116 12.3379L16.2 7.71921C16.3669 7.57579 16.6164 7.58628 16.7712 7.7427C16.9259 7.8987 16.9335 8.14821 16.7888 8.31385L10.9177 15.0235C10.8342 15.1182 10.7126 15.1711 10.586 15.166C10.4597 15.1614 10.3423 15.0998 10.2664 14.9987L7.7502 11.6439C7.62774 11.4804 7.64074 11.2527 7.78122 11.1042C7.9213 10.9558 8.14817 10.9302 8.31843 11.0434Z"
                  fill="black"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1310_1845"
                    x1="13.6429"
                    y1="24.6494"
                    x2="24.265"
                    y2="5.6274"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#C27CBC" />
                    <stop offset="0.619308" stop-color="#D3FF00" />
                    <stop offset="1" stop-color="#3BE32D" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="font-sans text-[11px] whitespace-nowrap">
                JOK NFT (4/5)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
