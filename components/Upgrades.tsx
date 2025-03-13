// components/Upgrades.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UpgradeItem } from "@/utils/types";
import { capitalizeFirstLetter, triggerHapticFeedback } from "@/utils/ui";
import UpgradeItemCard from "./upgrades/UpgradeItemCard";
import { useGameStore } from "@/utils/game-mechanics";
import TopInfoSection from "./TopInfoSection";
import { getUnlockRequirements } from "./UnlockRequirement";
import useFetchUpgrades from "@/hooks/useFetchUpgrades";
import { pageBackground } from "@/images";
import { useToast } from "@/contexts/ToastContext";

interface BoostProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

interface Subcategory {
  name: string;
  items: UpgradeItem[];
}

interface Category {
  name: string;
  subcategories: Subcategory[];
}

const useFetchUnlockRequirements = (): {
  requirementsUnlock: never[];
  isLoading: boolean;
} => {
  const [requirementsUnlock, setUnlockRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpgradeItems = async () => {
      try {
        const response = await fetch("/api/upgrade/unlockrequirement");
        if (!response.ok) {
          throw new Error("Failed to fetch unlock requirement");
        }
        const data = await response.json();
        setUnlockRequirements(data.unlockRequirements);
      } catch (error) {
        console.error("Error fetching unlock requirement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpgradeItems();
  }, []);

  return { requirementsUnlock, isLoading };
};

const Upgrades: React.FC<BoostProps> = ({ currentView, setCurrentView }) => {
  const showToast = useToast();
  const t = useTranslations("Upgrades");
  const { upgrades, isLoading } = useFetchUpgrades();

  const { requirementsUnlock } = useFetchUnlockRequirements();
  const { userUpgrades, userTelegramInitData, pointsBalance, setSkillUpgrade } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const activeCategorySet = useRef(false); // Track initial category setting

  const groupedUpgradesArray = useMemo(() => {
    const grouped: Record<string, Category> = upgrades.reduce(
      (acc, upgrade) => {
        if (!acc[upgrade.category]) {
          acc[upgrade.category] = {
            name: upgrade.category,
            subcategories: [],
          };
        }

        const category = acc[upgrade.category];
        const subcategoryIndex = category.subcategories.findIndex(
          (sub) => sub.name === upgrade.subcategory,
        );

        if (subcategoryIndex === -1) {
          // If the subcategory doesn't exist, create it
          category.subcategories.push({
            name: upgrade.subcategory,
            items: [],
          });
        }

        // Find the subcategory and push the upgrade item into it
        const subcategory = category.subcategories.find(
          (sub) => sub.name === upgrade.subcategory,
        );
        if (subcategory) {
          subcategory.items.push(upgrade);
        }

        return acc;
      },
      {} as Record<string, Category>,
    );

    return Object.values(grouped).map((category) => ({
      ...category,
      subcategories: category.subcategories,
    }));
  }, [upgrades]);

  // Get the categories from the grouped upgrades
  const categories = useMemo(
    () => groupedUpgradesArray.map((category) => category.name),
    [groupedUpgradesArray],
  );

  // Set the initial active category when categories are available
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
      activeCategorySet.current = true; // Ensure this runs only once
    }
  }, [categories, activeCategory]);

  // Filter the grouped upgrades based on the active category
  const filteredUpgrades = useMemo(() => {
    if (!activeCategory) return groupedUpgradesArray;

    return groupedUpgradesArray.filter(
      (category) => category.name === activeCategory,
    );
  }, [activeCategory, groupedUpgradesArray]);

  const buyUpgrade = async (upgradeId: string) => {
    if (processing) return;

    setProcessing(true);
    try {
      triggerHapticFeedback(window);
      const response = await fetch('/api/upgrade/skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          initData: userTelegramInitData,
          upgradeId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upgrade skill');
      }

      const result = await response.json();
      setSkillUpgrade(result.updatedUserUpgrade, result.upgradeCost, result.upgradeYield);
      showToast(t('upgradeSuccessful'), 'success');
    } catch (error) {
      console.error('Error upgrading skill:', error);
      showToast(error instanceof Error ? error.message : t('upgradeError'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
        <TopInfoSection setCurrentView={setCurrentView} />

        <div
          className="h-screen mt-4 bg-customGreen-700 rounded-t-[48px] relative top-glow z-0"
          style={{
            backgroundImage: `url(${pageBackground.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex-grow mt-[2px] rounded-t-[46px] h-full overflow-y-auto no-scrollbar relative">
            <div className="px-4 pt-1 pb-32">
              <div className="px-4 mt-4 flex justify-center">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={`text-base font-bold px-4 py-2 ${activeCategory === item
                      ? "text-customGreen-700 border-b-2 border-customGreen-700"
                      : " text-[#85827d]"
                      }`}
                    onClick={() => setActiveCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {isLoading ? (
                  <div className="text-center text-gray-400">
                    {t("loading")}
                  </div>
                ) : (
                  filteredUpgrades.map((category) => (
                    <div key={category.name} className="space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.name}>
                          <h3 className="text-sm mt-4 mb-2">
                            {capitalizeFirstLetter(subcategory.name)}
                          </h3>
                          <div className="space-y-2">
                            {subcategory.items.map((item) => {
                              const requirements = getUnlockRequirements(
                                item,
                                groupedUpgradesArray,
                                userUpgrades,
                                requirementsUnlock,
                              );
                              return (
                                <UpgradeItemCard
                                  item={item}
                                  key={item.id}
                                  userUpgrades={userUpgrades}
                                  isUnlocked={requirements.isUnlocked}
                                  isProcessing={processing}
                                  onBuy={buyUpgrade}
                                  unlockRequirement={
                                    requirements.previousItem &&
                                      !requirements.isUnlocked
                                      ? {
                                        itemName:
                                          requirements.previousItem.name,
                                        currentLevel:
                                          requirements.currentLevel,
                                        requiredLevel:
                                          requirements.requiredLevel,
                                      }
                                      : null
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrades;
