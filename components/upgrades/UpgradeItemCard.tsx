// components/UpgradeItemCard.tsx

import { JOK_POINTS_UP, upgradeImageMap } from '@/images';
import { calculateSkillUpgradeBenefit, calculateSkillUpgradeCost, useGameStore } from '@/utils/game-mechanics';
import { UpgradeItem, UserUpgrade } from '@/utils/types';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LockKeyhole } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface UnlockRequirement {
  itemName: string;
  currentLevel: number;
  requiredLevel: number;
}

interface UpgradeItemCardProps {
  item: UpgradeItem;
  userUpgrades: UserUpgrade[];
  isUnlocked: boolean;
  isProcessing: boolean;
  onBuy: (upgradeId: string) => Promise<void>;
  unlockRequirement: UnlockRequirement | null;
}

const UpgradeItemCard = memo(({ item, userUpgrades, isUnlocked, isProcessing, onBuy, unlockRequirement }: UpgradeItemCardProps) => {
  const t = useTranslations('UpgradeItemCard');
  const { name, basePoints, baseCost, image, id } = item;
  const { pointsBalance, } = useGameStore();

  const isLoadingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const [buttonState, setButtonState] = useState<{
    type: 'cost' | 'loading' | 'timer';
    value: number | string;
  }>({ type: 'cost', value: 0 });

  const userUpgrade = userUpgrades?.find((u) => u.upgradeId === id);
  const currentLevel = userUpgrade?.level ?? 0;

  const upgradeCost = calculateSkillUpgradeCost(currentLevel, baseCost);
  const nextUpgradePoints = calculateSkillUpgradeBenefit(currentLevel, basePoints);

  useEffect(() => {
    const updateTimer = () => {
      const cooldownEndsAt = userUpgrade?.cooldownEndsAt ? new Date(userUpgrade.cooldownEndsAt) : null;
      if (!cooldownEndsAt || isNaN(cooldownEndsAt.getTime())) {
        setButtonState({ type: 'cost', value: upgradeCost });
        return;
      }

      const remaining = cooldownEndsAt.getTime() - Date.now();
      if (remaining <= 0) {
        setButtonState({ type: 'cost', value: upgradeCost });
        return;
      }

      setButtonState({ type: 'timer', value: remaining });
      timerRef.current = setTimeout(updateTimer, 1000);
    };

    updateTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [userUpgrade?.cooldownEndsAt, upgradeCost]);

  const handleUpgradeClick = async () => {
    if (!isUnlocked || isLoadingRef.current || buttonState.type === 'timer') return;

    isLoadingRef.current = true;
    setButtonState({ type: 'loading', value: 0 });

    await onBuy(id);

    isLoadingRef.current = false;
    setButtonState({ type: 'cost', value: upgradeCost });

  };

  const isDisabled = !isUnlocked || isLoadingRef.current || buttonState.type === 'timer' || isProcessing;
  const isAffordable = pointsBalance >= upgradeCost;

  const renderButtonContent = () => {
    switch (buttonState.type) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
        );
      case 'timer':
        return (
          <span className="text-xs">
            {formatTime(buttonState.value as number)}
          </span>
        );
      default:
        return formatNumber(upgradeCost);
    }
  };

  return (
    <div className="w-full flex justify-between items-center bg-[#272a2f] bg-opacity-90 rounded-lg p-4 my-2 relative">
      <Image
        src={upgradeImageMap[image]}
        alt={image}
        className={`w-20 h-20 flex-shrink-0 rounded-lg ${isDisabled ? 'opacity-50' : ''}`}
      />

      <div className={`flex-1 flex flex-col ml-2 h-20 justify-between min-w-0 ${isDisabled || !isAffordable ? "opacity-50" : ""}`}>
        <p className="text-left font-medium truncate">{name}</p>
        <div className="flex items-center gap-1">
          <Image src={JOK_POINTS_UP} alt="points" width={24} height={24} className="flex-shrink-0" />
          <div className="truncate">
            <span>{formatNumber(nextUpgradePoints)} </span>
            <span className="text-xs text-gray-500">{t('pointsPerHour')}</span>
          </div>
        </div>
        <div className="flex items-center">
          {!isUnlocked && unlockRequirement && (
            <>
              <LockKeyhole size={14} className="text-gray-400 stroke-[3] flex-shrink-0" />
              <p className="text-xs text-gray-400 ml-2 truncate">
                {`${unlockRequirement.itemName} ${t('level')} ${unlockRequirement.requiredLevel}`}
              </p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleUpgradeClick}
        disabled={isDisabled || !isAffordable}
        className={`w-24 text-white bg-customGreen-700 px-4 py-2 rounded-full hover:bg-customGreen-800 
            ${isDisabled || !isAffordable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <div className="flex justify-center items-center">
          {renderButtonContent()}
        </div>
      </button>

      {currentLevel > 0 && (
        <span className="ml-1 min-w-6 min-h-6 text-white font-bold text-center text-xs absolute left-2 top-2 bg-customGreen-700 py-1 px-2 rounded-full shadow-md shadow-customGreen-900">
          {currentLevel}
        </span>
      )}
    </div>
  );
});

UpgradeItemCard.displayName = 'UpgradeItemCard';

export default UpgradeItemCard;