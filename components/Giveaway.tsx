// components/Giveaway.tsx

import React, { memo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/contexts/ToastContext";
import { giveaway } from "@/images";
import Image from "next/image";
import { useGameStore } from "@/utils/game-mechanics";
import Angle from "@/icons/Angle";

const BackgroundImage = memo(() => (
  <Image
    src={giveaway}
    alt="Giveaway Banner"
    fill
    className=" object-cover translate-y-10"
    style={{
      objectPosition: "center",
    }}
  />
));

const InfoButton = memo(() => {
  const t = useTranslations("Giveaway");

  return (
    <div className="relative w-full flex justify-center items-center">
      <a
        href={"/giveaway-info.html"}
        target={"_blank"}
        className="w-[163px] relative pl-[32px] pr-[5px] py-[5px] rounded-[35px] cursor-pointer pointer bg-gradient-button text-white text-xs z-50"
      >
        <div className="rounded-[35px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#151515] w-[calc(100%-3px)] h-[calc(100%-3px)]"></div>
        <div className="relative z-20 flex justify-between items-center">
          <div></div>
          <div className="flex items-center">
            <span className="font-medium">{t('moreInfo')}</span>
          </div>
          <div className="w-[30px] h-[30px] bg-[#000000] rounded-full flex justify-center items-center ">
            <Angle size={40} className="text-white" />
          </div>
        </div>
      </a>
      <div className="w-[80%] h-[11px] absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E546D8] via-[#7FC664] to-[#BEE110] blur-[7px]"></div>
    </div>
  );
});

const SubmissionForm = memo(
  ({
    onSubmit,
    isSubmitting,
  }: {
    onSubmit: (link: string) => Promise<void>;
    isSubmitting: boolean;
  }) => {
    const t = useTranslations("Giveaway");
    const [link, setLink] = useState("");
    const [error, setError] = useState("");

    const validateUrl = (url: string): boolean => {
      try {
        const newUrl = new URL(url);
        return newUrl.protocol === "http:" || newUrl.protocol === "https:";
      } catch (err) {
        return false;
      }
    };

    const handleSubmit = useCallback(async () => {
      // Clear previous error
      setError("");

      // Validate URL
      if (!link) {
        setError(t("errorRequired"));
        return;
      }

      if (!validateUrl(link)) {
        setError(t("errorInvalidUrl"));
        return;
      }

      await onSubmit(link);
      setLink("");
    }, [link, onSubmit, t]);

    return (
      <div className="flex flex-col w-full max-w-xl gap-2 absolute bottom-24 left-1/2 transform -translate-x-1/2 px-5">
        {error && (
          <span className="text-red-500 text-sm text-center">{error}</span>
        )}
        <div className="flex h-10 gap-1 justify-between text-xs">
          <input
            type="url"
            placeholder={t("inputPlaceholder")}
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setError(""); // Clear error on input change
            }}
            className={`flex-1 px-4 py-2 bg-[#D9DFFF17] border-2 border-[#FFFFFF38] rounded-3xl 
             placeholder-[#B4B4B4] focus:outline-none
            ${error ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          <button
            className={`h-full px-[1.3rem] py-2 bg-[#000000] rounded-3xl 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </div>
    );
  },
);

interface GiveawayPageProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const GiveawayPage: React.FC<GiveawayPageProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { userTelegramInitData } = useGameStore();
  const showToast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmission = useCallback(
    async (link: string) => {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/user/giveaway-sumbission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
            link,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to submit entry");
        }

        showToast("Entry submitted", "success");
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Failed to submit entry",
          "error",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [userTelegramInitData, showToast],
  );

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-gradient-airdrop-page-header rounded-t-[48px] relative top-glow z-0">
          <div className="mt-[2px] bg-[#080808] rounded-t-[46px] h-full overflow-y-auto  no-scrollbar flex flex-col items-center pb-24 pt-6 px-6">
            <BackgroundImage />
            <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+8px)]">
              <InfoButton />
            </div>

            <SubmissionForm
              onSubmit={handleSubmission}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(GiveawayPage);
