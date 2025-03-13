// components/Loading.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { botUrlQr, JokHeadOnly, loadingScreen, pageBackground } from '@/images';
import {
  calculateEnergyLimit,
  calculateLevelIndex,
  calculatePointsPerClick,
  calculateProfitPerHour,
  GameState,
  InitialGameState,
  useGameStore
} from '@/utils/game-mechanics';
import UAParser from 'ua-parser-js';
import { ALLOW_ALL_DEVICES } from '@/utils/consts';
import { useTranslations } from 'next-intl';
import Button from './ui/button';
import { calculateYieldPerHour } from '@/utils/calculations';

interface LoadingProps {
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: (view: string) => void;
}

export default function Loading({ setIsInitialized, setCurrentView }: LoadingProps) {
  const t = useTranslations('Loading');
  const initializeState = useGameStore((state: GameState) => state.initializeState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const openTimestampRef = useRef(Date.now());
  const [isAppropriateDevice, setIsAppropriateDevice] = useState(true);

  const fetchOrCreateUser = useCallback(async () => {
    try {
      let initData, telegramId, username, telegramName, startParam;

      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        
        initData = WebApp.initData;
        telegramId = WebApp.initDataUnsafe.user?.id.toString();
        username = WebApp.initDataUnsafe.user?.username || 'Unknown';
        telegramName = WebApp.initDataUnsafe.user?.first_name || 'Unknown';

        startParam = WebApp.initDataUnsafe.start_param;
      }

      const referrerTelegramId = startParam ? startParam.replace('kentId', '') : null;

      if (process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true') {
        initData = 'temp';
      }
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegramInitData: initData,
          referrerTelegramId
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch or create user');
      }
      const userData = await response.json();

      // Check if initData and telegramName are defined
      if (!initData) {
        throw new Error('initData is undefined');
      }
      if (!telegramName) {
        throw new Error('telegramName is undefined');
      }

      const inventoryObj = userData.inventory?.items?.reduce((acc: any, item: any) => {
        const mergedItem = { ...item, ...item.shopItem };
        delete mergedItem.shopItem;
        acc.push(mergedItem);
        return acc;
      }, []);

      const yieldPerHour = calculateYieldPerHour(userData.bonusYieldPerHour ?? 0, userData.yieldPerHour);

      // Create the game store with fetched data
      const initialState: InitialGameState = {
        userTelegramInitData: initData,
        userTelegramName: telegramName,
        lastClickTimestamp: userData.lastPointsUpdateTimestamp,
        gameLevelIndex: calculateLevelIndex(yieldPerHour),
        points: userData.points,
        pointsBalance: userData.pointsBalance,
        unsynchronizedPoints: 0,
        multitapLevelIndex: userData.multitapLevelIndex,
        pointsPerClick: calculatePointsPerClick(userData.multitapLevelIndex),
        energy: userData.energy,
        maxEnergy: calculateEnergyLimit(userData.energyLimitLevelIndex),
        energyRefillsLeft: userData.energyRefillsLeft,
        energyLimitLevelIndex: userData.energyLimitLevelIndex,
        lastEnergyRefillTimestamp: userData.lastEnergyRefillsTimestamp,
        mineLevelIndex: userData.mineLevelIndex,
        profitPerHour: calculateProfitPerHour(userData.mineLevelIndex),
        tonWalletAddress: userData?.tonWalletAddress,
        userUpgrades: userData?.userUpgrades,
        upgradeYieldPerHour: userData?.yieldPerHour,
        bonusYieldPerHour: userData?.bonusYieldPerHour,
        bonusOfflineYieldDuration: userData?.bonusOfflineYieldDuration,
        lastYieldTimestamp: userData?.lastUpgradeYieldTimestamp,
        lastClaimRewardDay: userData.lastClaimRewardDay,
        lastClaimRewardTimestamp: userData.lastClaimRewardTimestamp,
        twitterHandle: userData.twitterHandle,
        erc20Wallet: userData.erc20Wallet,
        equippedAvatar: userData.inventory?.equippedAvatar
          ? inventoryObj.find((item: any) => item.id === userData.inventory?.equippedAvatar)?.image
          : null,
        equippedWallpaper: userData.inventory?.equippedBackground
          ? inventoryObj.find((item: any) => item.id === userData.inventory?.equippedBackground)?.image
          : null,
        inventory: inventoryObj,
        lastHolderCheckTimestamp: userData.lastHolderCheckTimestamp,
        isHolder: userData.isHolder || false,
        holderLevel: userData.holderLevel || 0,
        isAirdropRequirementMet: userData.isAirdropRequirementMet || false,
        fakeFriends: userData.fakeFriends || 0,
        activeOfflineBoostEndTime: userData.activeOfflineBoostEndTime || 0,
        activeRewardBoostEndTime: userData.activeRewardBoostEndTime || 0,
        activeOfflineBoostDuration: userData.activeOfflineBoostDuration || 0,
        activeRewardBoostMultiplier: userData.activeRewardBoostMultiplier || 0,
        totalStars: userData.totalStars || 0,
        earnedStars: userData.earnedStars || 0
      };

      initializeState(initialState);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., show error message to user)
    }
  }, [initializeState]);

  useEffect(() => {
    const parser = new UAParser();
    const device = parser.getDevice();
    const isAppropriate = ALLOW_ALL_DEVICES || device.type === 'mobile' || device.type === 'tablet';
    setIsAppropriateDevice(isAppropriate);

    if (isAppropriate) {
      fetchOrCreateUser();
    }
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - openTimestampRef.current;
      const remainingTime = Math.max(3000 - elapsedTime, 0);

      const timer = setTimeout(() => {
        const isIntroEnded = localStorage.getItem('introEnded') === 'true';
        setIsInitialized(true);
        if (isIntroEnded) {
          setCurrentView('myjok');
          return;
        }

        setCurrentView('intro1');
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isDataLoaded, setIsInitialized, setCurrentView]);

  if (!isAppropriateDevice) {
    return (
      <div
        className='bg-[#1d2025] flex justify-center items-center h-screen'
        style={{
          backgroundImage: `url(${pageBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className='w-full max-w-xl text-white flex flex-col items-center'>
          <div className='flex items-start justify-center gap-1'>
            <Image src={JokHeadOnly} alt='JOK Head' width={48} height={32} objectFit='contain' />
            <h1 className='text-3xl font-bold'>{t('JOKer')},</h1>
          </div>
          <h1 className='text-3xl font-bold text-center'>{t('message')}</h1>
          <Image className='bg-white p-2 rounded-xl my-6' src={botUrlQr} alt='QR Code' width={200} height={200} />

          <a href='https://t.me/JokInTheBoxOfficial' target='_blank' rel='noreferrer'>
            <Button className='py-4'>{t('joinCommunity')}</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#1d2025] flex justify-center items-center h-screen'>
      <Image
        src={loadingScreen}
        alt='Main Character'
        fill
        style={{
          objectFit: 'contain',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}
