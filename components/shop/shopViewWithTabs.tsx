import { useTranslations } from "next-intl";
import Image from "next/image";
import { avatarCarpet, JOK_POINTS_UP, shopImageMap, upgrades } from "@/images";
import { ShopItem } from "@/utils/types";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/utils/game-mechanics";
import { UserInventoryItem } from "@prisma/client";

interface ShopViewWithTabsProps {
  items: ShopItem[];
  handleBuyItem: (item: ShopItem) => Promise<void>;
  handleEquipItem: (item: ShopItem) => Promise<void>;
}

enum Tab {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
}

const ItemCard = memo(
  ({
    item,
    isSelected,
    isEquipped,
    isBought,
    onClick,
    gameLevelIndex,
  }: {
    item: ShopItem;
    isSelected: boolean;
    isEquipped: boolean;
    isBought: boolean;
    onClick: () => void;
    gameLevelIndex: number;
  }) => {
    const isLevelRequired = item.level && item.level > gameLevelIndex + 1;
    const borderColor = isSelected
      ? "border-white"
      : isEquipped
        ? "border-customGreen-700"
        : "border-transparent";

    return (
      <div
        className={`relative rounded-lg border-2 z-10 ${borderColor}`}
        onClick={onClick}
      >
        {(isLevelRequired || (!item.isBasic && !isBought)) && (
          <div className="absolute top-1 left-1 z-10">
            <Image src={"/item-closed.png"} alt={""} width={23} height={22} />
          </div>
        )}
        <Image
          src={shopImageMap[`${item.image}_Thumb`]}
          width={64}
          height={64}
          alt={item.name}
          className={`w-full h-full object-cover ${(isLevelRequired || (!item.isBasic && !isBought)) ? "opacity-45" : ""}`}
        />
      </div>
    );
  },
);

const ItemPreview = memo(
  ({
    selectedItem,
    isItemBought,
    handleBuyItem,
    handleEquipItem,
    gameLevelIndex,
    loading,
  }: {
    selectedItem: ShopItem;
    isItemBought: boolean;
    handleBuyItem: (item: ShopItem) => void;
    handleEquipItem: (item: ShopItem) => void;
    gameLevelIndex: number;
    loading: boolean;
  }) => {
    const t = useTranslations("Shop");
    return (
      <div className="flex gap-2 rounded-lg justify-between items-center  my-[24px] relative z-10">
        <div
          className={`${selectedItem.category === "AVATAR" ? "w-[172px] h-[178px]" : "w-[132px] h-[235px]"} relative`}
        >
          {selectedItem.category === "AVATAR" ? (
            <>
              <Image
                src={avatarCarpet}
                alt="carpet"
                className="w-full h-full rounded-lg object-contain absolute inset-0 z-0 transform"
              />
              <Image
                src={shopImageMap[selectedItem.image]}
                alt={selectedItem.name}
                className="w-full h-full rounded-lg object-contain absolute -top-5 z-10 transform"
              />
            </>
          ) : (
            selectedItem.category === "BACKGROUND" && (
              <Image
                src={shopImageMap[selectedItem.image]}
                alt={selectedItem.name}
                className="w-full h-full rounded-lg object-cover z-10"
              />
            )
          )}
        </div>
        <div className="flex flex-1 flex-col gap-[19px] w-full max-w-[187px]">
          <div>
            <div className="text-xl font-medium text-wrap">
              {t(selectedItem.name)}
            </div>
            <div className="text-sm font-normal mt-[10px] text-wrap">
              {t(selectedItem.description)}
            </div>
          </div>

          <ActionButton
            item={selectedItem}
            isItemBought={isItemBought}
            handleBuyItem={handleBuyItem}
            handleEquipItem={handleEquipItem}
            gameLevelIndex={gameLevelIndex}
            isLoading={loading}
          />
        </div>
      </div>
    );
  },
);

const ActionButton = memo(
  ({
    item,
    isItemBought,
    handleBuyItem,
    handleEquipItem,
    gameLevelIndex,
    isLoading,
  }: {
    item: ShopItem;
    isItemBought: boolean;
    handleBuyItem: (item: ShopItem) => void;
    handleEquipItem: (item: ShopItem) => void;
    gameLevelIndex: number;
    isLoading: boolean;
  }) => {
    const t = useTranslations("Shop");

    if (isItemBought || item.isBasic) {
      return (
        <div className="flex flex-col gap-2">
          {item.isBasic && item.level && item.level > gameLevelIndex + 1 ? (
            <div className="flex items-center justify-center gap-2">
              <span>
                {t("levelRequired")} {item.level}
              </span>
            </div>
          ) : (
            <button
              onClick={() => !isLoading && handleEquipItem(item)}
              disabled={isLoading}
              className={`h-[42px] w-[137px] relative py-[5px] rounded-[35px] cursor-pointer pointer bg-gradient-button text-white text-xs 
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="rounded-[35px] absolute z-10 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#3f3842] w-[calc(100%-3px)] h-[calc(100%-3px)]"></div>
              <div className="text-sm font-medium relative z-20 flex justify-center items-center gap-2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  t("equip")
                )}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[80%] h-[16px] bg-gradient-to-r from-[#E546D8] via-[#A6DA93] to-[#BEE110] blur-[14.2px]"></div>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {item.category === "AVATAR" ? (
          <div className="flex items-center justify-center gap-2">
            <Image
              src={JOK_POINTS_UP}
              alt="JOK Points"
              width={40}
              height={40}
              className="w-6 h-6 mr-1"
            />
            <span className="text-white text-sm font-medium">
              +{t("PremiumAvatarBenefit")}
            </span>
          </div>
        ) : (
          item.category === "BACKGROUND" && (
            <div className="flex items-center justify-center gap-2">
              <Image
                src={upgrades}
                alt="JOK Points"
                width={40}
                height={40}
                className="w-6 h-6 mr-1"
              />
              <span className="text-white text-sm font-medium">
                +{t("PremiumBgBenefit")}
              </span>
            </div>
          )
        )}
        <button
          onClick={() => !isLoading && handleBuyItem(item)}
          disabled={isLoading}
          className={`h-[42px] ${item.category === "AVATAR" ? "w-[155px]" : "w-[187px]"} relative py-[5px] rounded-[35px] cursor-pointer pointer bg-gradient-button text-white text-xs
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="rounded-[35px] absolute z-10 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[#3f3842] w-[calc(100%-3px)] h-[calc(100%-3px)]"></div>
          <div className="text-sm font-medium relative z-20 flex justify-center gap-[6px] items-center">
            <div>
              <Image src={"/star.png"} alt={""} width={24} height={24} />
            </div>
            <div>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {t("buttonText")}{" "}
                  <span className="capitalize">
                    {item.category.toLowerCase()}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[80%] h-[16px] bg-gradient-to-r from-[#E546D8] via-[#A6DA93] to-[#BEE110] blur-[14.2px]"></div>
        </button>
        <p className="text-xs text-center text-pretty text-white font-normal">
          {t("disclaimer")}
        </p>
      </div>
    );
  },
);

export default function ShopViewWithTabs({
  items,
  handleBuyItem,
  handleEquipItem,
}: ShopViewWithTabsProps) {
  const { inventory, equippedAvatar, equippedWallpaper, gameLevelIndex } =
    useGameStore();
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.BASIC);
  const [isLoading, setIsLoading] = useState(false);

  const basicItems = useMemo(
    () =>
      items
        .filter((item) => item.isBasic)
        .sort((a, b) => (a.level || 0) - (b.level || 0)),
    [items],
  );
  const premiumItems = useMemo(
    () => items.filter((item) => !item.isBasic),
    [items],
  );
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(
    basicItems?.[0] || premiumItems?.[0] || null,
  );

  const isItemBought = useMemo(() => {
    return (item: ShopItem) => {
      if (!inventory || !Array.isArray(inventory)) return false;
      return inventory.some(
        (inventoryItem: UserInventoryItem) =>
          inventoryItem.shopItemId === item.id,
      );
    };
  }, [inventory]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedItem({ ...selectedItem });
    }
  }, [inventory]);

  const t = useTranslations("Shop");

  const buyItem = async (item: ShopItem) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await handleBuyItem(item);
      setSelectedItem({ ...item });
    } finally {
      setIsLoading(false);
    }
  };

  const equipItem = async (item: ShopItem) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await handleEquipItem(item);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Image
        src={"/bg-shop-gradient-1.png"}
        alt={""}
        width={232}
        height={384}
        className="absolute -translate-x-4"
      />
      {selectedItem && (
        <ItemPreview
          selectedItem={selectedItem}
          isItemBought={isItemBought(selectedItem)}
          handleBuyItem={buyItem}
          handleEquipItem={equipItem}
          gameLevelIndex={gameLevelIndex}
          loading={isLoading}
        />
      )}
      <div className="w-max mx-auto rounded-[24px] p-[3px] flex justify-center gap-2 bg-[#1E2023] relative z-10">
        <button
          onClick={() => setSelectedTab(Tab.BASIC)}
          className={`flex items-center px-4 py-2 rounded-full text-white border ${selectedTab === Tab.BASIC ? "bg-black border-[#2e2e2e] " : "border-transparent"} `}
        >
          {t("basic")}
        </button>
        <button
          onClick={() => setSelectedTab(Tab.PREMIUM)}
          className={`flex items-center px-4 py-2 rounded-full text-white border ${selectedTab === Tab.PREMIUM ? " bg-black border-[#2e2e2e] " : "border-transparent"} `}
        >
          {t("premium")}
        </button>
      </div>

      <div className="relative grid grid-cols-3 gap-2 mt-[29px]">
        {(selectedTab === Tab.BASIC ? basicItems : premiumItems).map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isSelected={selectedItem?.id === item.id}
            isEquipped={
              item.image === equippedAvatar || item.image === equippedWallpaper
            }
            isBought={isItemBought(item)}
            gameLevelIndex={gameLevelIndex}
            onClick={() => setSelectedItem(item)}
          />
        ))}
        <Image
          src={"/bg-shop-gradient-2.png"}
          alt={""}
          width={232}
          height={384}
          className="absolute bottom-0 right-0 translate-x-4 translate-y-[128px]"
        />
      </div>
    </div>
  );
}
