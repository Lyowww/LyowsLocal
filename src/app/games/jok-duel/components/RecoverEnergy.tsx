import Image from "next/image";
import {
  adPlayIcon,
  congratsTop,
  energyIcon,
  recoveryBg,
  starIcon,
  watchAdBg,
} from "../images";
import { useRef } from "react";

interface RecoverEnergyProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const RecoverEnergy: React.FC<RecoverEnergyProps> = ({
  currentView,
  setCurrentView,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleWatch = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
        playsInline
      >
        <source src={recoveryBg} type="video/mp4" />
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
          <div className="w-[30px] h-[30px] flex items-center justify-center absolute z-20 right-[5%] border border-[#FFFFFF4D] rounded-[8px] top-[60%]">
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.625 9.6875L6 5.3125M6 5.3125L10.375 0.9375M6 5.3125L1.625 0.9375M6 5.3125L10.375 9.6875"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Image
            src={congratsTop}
            alt="not found"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <div>
            <h1 className="absolute left-[35%] transform rotate-[-10deg]  -translate-x-1/2 top-[72%] font-extralight text-[20px] rounded-[10px]">
              R
            </h1>
            <h1 className="absolute left-[40%] transform rotate-[-7deg]  -translate-x-1/2 top-[68%] font-extralight text-[20px] rounded-[10px]">
              E
            </h1>
            <h1 className="absolute left-[45%] transform rotate-[0deg]  -translate-x-1/2 top-[65%] font-extralight text-[20px] rounded-[10px]">
              C
            </h1>
            <h1 className="absolute left-[50%] transform rotate-[0deg]  -translate-x-1/2 top-[64%] font-extralight text-[20px] rounded-[10px]">
              O
            </h1>
            <h1 className="absolute left-[55%] transform rotate-[5deg]  -translate-x-1/2 top-[66%] font-extralight text-[20px] rounded-[10px]">
              V
            </h1>
            <h1 className="absolute left-[60%] transform rotate-[7deg]  -translate-x-1/2 top-[68%] font-extralight text-[20px] rounded-[10px]">
              E
            </h1>
            <h1 className="absolute left-[65%] transform rotate-[12deg]  -translate-x-1/2 top-[72%] font-extralight text-[20px] rounded-[10px]">
              R
            </h1>
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 top-[87%] font-extralight text-[20px] rounded-[10px] tracking-[4px]">
            Energy
          </h1>
          <div className="absolute top-[150%] left-1/2 -translate-x-1/2 flex items-center gap-1">
            <svg
              width="18"
              height="20"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.90474 5.28861C8.80557 6.8574 6.51895 10.1633 5.43528 11.7131C5.12591 12.1578 4.4278 11.9032 4.47808 11.3637L4.8197 7.67869C4.84873 7.36995 4.60507 7.10308 4.295 7.10308C-1.88655 7.09847 -0.0212987 7.99211 1.54831 0.472841C1.60839 0.240245 1.81853 0.0771484 2.05897 0.0771484H6.9603C7.30578 0.0771484 7.55785 0.404605 7.46951 0.739143L6.65991 3.7983C6.57163 4.13284 6.82364 4.46029 7.16912 4.46029H9.47218C9.89766 4.46036 10.1478 4.93927 9.90474 5.28861Z"
                fill="#4ECDEA"
              />
              <path
                d="M7.34443 8.97155L5.43776 11.7123C5.12839 12.1571 4.43028 11.9025 4.48056 11.363L4.82218 7.67793C4.85121 7.36919 4.60754 7.10232 4.29748 7.10232H0.527381C0.183168 7.10232 -0.0688426 6.77745 0.0168472 6.44418L1.55092 0.4722C1.66272 -0.173035 2.95743 0.148919 3.37633 0.0764458L2.50166 4.41381C2.39592 4.93718 2.79623 5.42646 3.33061 5.42646H5.79221C6.36137 5.42646 6.76813 5.9776 6.59985 6.52159L6.18089 7.87649C5.97099 8.63404 6.65335 9.07716 7.34443 8.97155Z"
                fill="#4F9CE8"
              />
            </svg>
            <h1 className="text-[20px] font-extralight">50</h1>
          </div>
        </div>
        <div className="absolute top-[180%] left-1/2 -translate-x-1/2">
          <Image
            src={energyIcon}
            alt="not found"
            width={30}
            height={30}
            className="absolute z-10"
          />
          <div
            className="w-[100px] h-[20px] rounded-[7px] mt-1 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(to right, #44F756, #D3EB2F, #D684F5, #ADA3D9)",
            }}
          >
            <div className="bg-white border-[#F4D77C] border-[2px] border-r-[3px] w-[90%] h-[14px] rounded-[7px]">
              <div
                className="h-full w-[70px] rounded-[7px]"
                style={{
                  background: "linear-gradient(to right, #004989, #004989)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => handleWatch()}
        className="absolute bottom-[20%] w-[300px] transform -translate-x-1/2 left-1/2"
      >
        <Image width={300} src={watchAdBg} alt="not found" />
        <Image
          src={adPlayIcon}
          width={30}
          className="absolute z-10 top-[22%] left-[7%]"
          alt="not found"
        />
        <h1 className="absolute z-10 text-[15px] top-[27%] right-[8%] font-extralight">
          Watch an add gain +10 energy
        </h1>
      </div>
      <div className="absolute bottom-[13%] w-[300px] transform -translate-x-1/2 left-1/2">
        <Image width={300} src={watchAdBg} alt="not found" />
        <Image
          src={starIcon}
          width={30}
          className="absolute z-10 top-[22%] left-[7%]"
          alt="not found"
        />
        <h1 className="absolute z-10 text-[15px] top-[17%] right-[4%] font-extralight w-[80%] text-center">
          Spend 100 stars ,restore full energy (50)
        </h1>
      </div>
      <div className="flex items-center justify-center gap-1 bottom-[8%] absolute z-[30] transform left-1/2 -translate-x-1/2 w-full">
        <div
          className="w-[26px] h-[26px] flex items-center justify-center transform -translate-x-1/2 left-1/2 rounded-full"
          style={{
            background: "linear-gradient(to right, #77DD00, #407700)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.1014 6.99199H9.00801V1.89863C9.00801 1.63129 8.90181 1.3749 8.71277 1.18586C8.52373 0.996825 8.26734 0.890625 8 0.890625C7.73266 0.890625 7.47627 0.996825 7.28723 1.18586C7.09819 1.3749 6.99199 1.63129 6.99199 1.89863V6.99199H1.89863C1.63129 6.99199 1.3749 7.09819 1.18586 7.28723C0.996825 7.47627 0.890625 7.73266 0.890625 8C0.890625 8.26734 0.996825 8.52373 1.18586 8.71277C1.3749 8.90181 1.63129 9.00801 1.89863 9.00801H6.99199V14.1014C6.99199 14.3687 7.09819 14.6251 7.28723 14.8141C7.47627 15.0032 7.73266 15.1094 8 15.1094C8.26734 15.1094 8.52373 15.0032 8.71277 14.8141C8.90181 14.6251 9.00801 14.3687 9.00801 14.1014V9.00801H14.1014C14.3687 9.00801 14.6251 8.90181 14.8141 8.71277C15.0032 8.52373 15.1094 8.26734 15.1094 8C15.1094 7.73266 15.0032 7.47627 14.8141 7.28723C14.6251 7.09819 14.3687 6.99199 14.1014 6.99199Z"
              fill="white"
            />
          </svg>
        </div>
        <h1 className="font-extralight text-[15px]">
          +0.2 Energy every 60 seconds
        </h1>
      </div>
    </div>
  );
};
