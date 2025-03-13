// utils/consts.ts

import {
  character1,
  character1_Thumb,
  character2,
  character2_Thumb,
  character3,
  character3_Thumb,
  character4,
  character4_Thumb,
  character5,
  character5_Thumb,
  character6,
  character6_Thumb,
  character7,
  character7_Thumb,
  character8,
  character8_Thumb,
  character9,
  character9_Thumb,
  character10,
  character10_Thumb,
  character11,
  character11_Thumb,
  character12,
  character12_Thumb
} from '@/images';
import { UIWallet } from '@tonconnect/ui-react';
import { StaticImageData } from 'next/image';

export const ALLOW_ALL_DEVICES = false;

export const WALLET_MANIFEST_URL = 'https://quests.jokinthebox.com/tonconnect-manifest.json';
export const TOKEN_INFO_URL = 'https://www.coingecko.com/en/coins/jokinthebox';
export const JOK_IN_THE_BOX_URL = 'https://jokinthebox.com/';
export const BUY_JOK_URL =
  'https://app.uniswap.org/swap?%20-%3E%20inputCurrency=ETH&outputCurrency=0xa728aa2de568766e2a4544e%20c7a7779c0bf9f97&chain=mainnet';

export interface LevelData {
  name: string;
  minPoints: number;
  minYieldPerHour: number;
  bigImage: StaticImageData;
  smallImage: StaticImageData;
  color: string;
  friendBonus: number;
  friendBonusPremium: number;
}

export const LEVELS: LevelData[] = [
  {
    name: 'Jok Novice',
    minPoints: 0,
    minYieldPerHour: 0,
    bigImage: character1,
    smallImage: character1_Thumb,
    color: '#2adaf8',
    friendBonus: 0,
    friendBonusPremium: 0
  },
  {
    name: 'Jok Apprentice',
    minPoints: 5000,
    minYieldPerHour: 1000,
    bigImage: character2,
    smallImage: character2_Thumb,
    color: '#d64767',
    friendBonus: 20000,
    friendBonusPremium: 25000
  },
  {
    name: 'Jok Jester',
    minPoints: 25000,
    minYieldPerHour: 3000,
    bigImage: character3,
    smallImage: character3_Thumb,
    color: '#e9c970',
    friendBonus: 30000,
    friendBonusPremium: 50000
  },
  {
    name: 'Jok Trickster',
    minPoints: 100000,
    minYieldPerHour: 9000,
    bigImage: character4,
    smallImage: character4_Thumb,
    color: '#73e94b',
    friendBonus: 40000,
    friendBonusPremium: 75000
  },
  {
    name: 'Jok Clown',
    minPoints: 1000000,
    minYieldPerHour: 27000,
    bigImage: character5,
    smallImage: character5_Thumb,
    color: '#4ef0ba',
    friendBonus: 60000,
    friendBonusPremium: 100000
  },
  {
    name: 'Jok Prankster',
    minPoints: 2000000,
    minYieldPerHour: 81000,
    bigImage: character6,
    smallImage: character6_Thumb,
    color: '#1a3ae8',
    friendBonus: 100000,
    friendBonusPremium: 150000
  },
  {
    name: 'Jok Illusionist',
    minPoints: 10000000,
    minYieldPerHour: 243000,
    bigImage: character7,
    smallImage: character7_Thumb,
    color: '#902bc9',
    friendBonus: 250000,
    friendBonusPremium: 500000
  },
  {
    name: 'Jok Mastermind',
    minPoints: 50000000,
    minYieldPerHour: 729000,
    bigImage: character8,
    smallImage: character8_Thumb,
    color: '#fb8bee',
    friendBonus: 500000,
    friendBonusPremium: 1000000
  },
  {
    name: 'Jok Sorcerer',
    minPoints: 100000000,
    minYieldPerHour: 2190000,
    bigImage: character9,
    smallImage: character9_Thumb,
    color: '#e04e92',
    friendBonus: 1000000,
    friendBonusPremium: 2000000
  },
  {
    name: 'Jok Magician',
    minPoints: 500000000,
    minYieldPerHour: 6560000,
    bigImage: character10,
    smallImage: character10_Thumb,
    color: '#e04e92',
    friendBonus: 5000000,
    friendBonusPremium: 10000000
  },
  {
    name: 'Jok Trickster Supreme',
    minPoints: 1000000000,
    minYieldPerHour: 19680000,
    bigImage: character11,
    smallImage: character11_Thumb,
    color: '#e04e92',
    friendBonus: 10000000,
    friendBonusPremium: 50000000
  },
  {
    name: 'Jok Legend',
    minPoints: 59050000,
    minYieldPerHour: 177150000,
    bigImage: character12,
    smallImage: character12_Thumb,
    color: '#e04e92',
    friendBonus: 50000000,
    friendBonusPremium: 100000000
  }
];

export const MAXIMUM_INACTIVE_TIME_FOR_MINE = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export const MAX_ENERGY_REFILLS_PER_DAY = 6;
export const MAX_REWARD_CLAIM = 1;
export const ENERGY_REFILL_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

export const REFERRAL_BONUS_BASE = 5000;
export const REFERRAL_BONUS_PREMIUM = 25000;

// Multitap
export const multitapUpgradeBasePrice = 1000;
export const multitapUpgradeCostCoefficient = 2;

export const multitapUpgradeBaseBenefit = 1;
export const multitapUpgradeBenefitCoefficient = 1;

// Energy
export const energyUpgradeBasePrice = 1000;
export const energyUpgradeCostCoefficient = 2;

export const energyUpgradeBaseBenefit = 500;
export const energyUpgradeBenefitCoefficient = 1;

// Mine (profit per hour)
export const mineUpgradeBasePrice = 1000;
export const mineUpgradeCostCoefficient = 1.5;

export const mineUpgradeBaseBenefit = 100;
export const mineUpgradeBenefitCoefficient = 1.2;

// Upgrade Skill
export const skillUpgradeCostCoefficient = 1.8;
export const skillUpgradeBenefitCoefficient = 1.2;
export const skillUpgradeTimeCoefficient = 1.7;
export const skillUpgradeBaseTime = 10;
export const MAX_COOLDOWN_TIME = 24 * 60 * 60; // 24 hours in seconds

// Daily Rewards
export const DAILY_REWARDS_BASE = 1000;
export const DAILY_REWARDS_COEFFICIENT_BASE = 1.1;
export const DAILY_REWARDS_COEFFICIENT_PREMIUM = 1.08;

// QUESTS
export const TASK_DAILY_RESET_TIME = 10; // UTC hour in 24-hour format
export const TASK_WAIT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// Profile
export const TELEGRAM_STORY_TEXT = 'I am a Jokster!, Join me in the Jok In The Box game and let us have fun together!';

// Yield per hour
export const MAX_YIELD_HOURS = 3;

// Submissions
export const DAILY_SUBMISSIONS_LIMIT = 10;

// Daily TON transaction amount
export const DAILY_TON_TRANSACTION_AMOUNT = 0.25;
export const DAILY_TON_TRANSACTION_ADDRESS = 'UQCaA2tXwvtPmCKOc2kuLqhpLvvgNBAWWwMDa77wp1eUDC97';

// Airdrop registration
export const AIRDROP_REGISTRATION_AMOUNT = 0.6;

// New User Bonus
export const NEW_USER_BONUS_POINTS = 5000;
export const NEW_USER_BONUS_STARS = 10;

// Telegram bot chat auto-reply
export const TELEGRAM_BOT_AUTO_REPLY =
  '🎩 *Welcome to JokInTheBox\\!* 🚀  \n\n🎯 *Earn rewards in \\$TON with our Play\\-to\\-Earn Telegram game\\!*  \n📌 Complete quests, invite friends, and level up your JOKER to maximize your earnings\\!  \n\n🔥 *The adventure starts now\\! Click the button below to join the game\\.*  \n\n👇 *Start Playing Now\\!* 👇  \n🔗 [JokInTheBox App](https://t\\.me/JokInTheBox\\_bot/JokInTheBox?startapp)  🎁✨';

export const TELEGRAM_BOT_WELCOME_MESSAGE =
  '🎭 *Welcome to JokInTheBox!* 🎰💎 \n\nYou’ve just unlocked *5000 points & 10*⭐ to start your journey! 🚀🔥 \nComplete quests, spin the wheel, bluff your way to victory, and *earn real rewards* in $TON!\n\n*Your luck starts NOW!* 🎲💰';

// Wallets list
export const WALLET_LIST: UIWallet[] = [
  {
    appName: 'telegram-wallet',
    name: 'Wallet',
    imageUrl: 'https://wallet.tg/images/logo-288.png',
    aboutUrl: 'https://wallet.tg/',
    universalLink: 'https://t.me/wallet?attach=wallet',
    bridgeUrl: 'https://walletbot.me/tonconnect-bridge/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'tonkeeper',
    name: 'Tonkeeper',
    imageUrl: 'https://tonkeeper.com/assets/tonconnect-icon.png',
    tondns: 'tonkeeper.ton',
    aboutUrl: 'https://tonkeeper.com',
    universalLink: 'https://app.tonkeeper.com/ton-connect',
    deepLink: 'tonkeeper-tc://',
    bridgeUrl: 'https://bridge.tonapi.io/bridge',
    jsBridgeKey: 'tonkeeper',
    platforms: ['ios', 'android', 'chrome', 'firefox', 'macos']
  },
  {
    appName: 'mytonwallet',
    name: 'MyTonWallet',
    imageUrl: 'https://static.mytonwallet.io/icon-256.png',
    aboutUrl: 'https://mytonwallet.io',
    universalLink: 'https://connect.mytonwallet.org',
    jsBridgeKey: 'mytonwallet',
    bridgeUrl: 'https://tonconnectbridge.mytonwallet.org/bridge/',
    platforms: ['chrome', 'windows', 'macos', 'linux', 'ios', 'android', 'firefox']
  },
  {
    appName: 'tonhub',
    name: 'Tonhub',
    imageUrl: 'https://tonhub.com/tonconnect_logo.png',
    aboutUrl: 'https://tonhub.com',
    universalLink: 'https://tonhub.com/ton-connect',
    jsBridgeKey: 'tonhub',
    bridgeUrl: 'https://connect.tonhubapi.com/tonconnect',
    platforms: ['ios', 'android']
  },
  {
    appName: 'bitgetTonWallet',
    name: 'Bitget Wallet',
    imageUrl:
      'https://raw.githubusercontent.com/bitgetwallet/download/refs/heads/main/logo/png/bitget_wallet_logo_288_mini.png',
    aboutUrl: 'https://web3.bitget.com',
    deepLink: 'bitkeep://',
    jsBridgeKey: 'bitgetTonWallet',
    bridgeUrl: 'https://ton-connect-bridge.bgwapi.io/bridge',
    platforms: ['ios', 'android', 'chrome'],
    universalLink: 'https://bkcode.vip/ton-connect'
  },
  {
    appName: 'okxMiniWallet',
    name: 'OKX Mini Wallet',
    imageUrl: 'https://static.okx.com/cdn/assets/imgs/2411/8BE1A4A434D8F58A.png',
    aboutUrl: 'https://www.okx.com/web3',
    universalLink: 'https://t.me/OKX_WALLET_BOT?attach=wallet',
    bridgeUrl: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'binanceWeb3TonWallet',
    name: 'Binance Wallet',
    imageUrl: 'https://public.bnbstatic.com/static/binance-w3w/ton-provider/binancew3w.png',
    aboutUrl: 'https://www.binance.com/en/web3wallet',
    deepLink: 'bnc://app.binance.com/cedefi/ton-connect',
    jsBridgeKey: 'binancew3w',
    bridgeUrl: 'https://wallet.binance.com/tonbridge/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux'],
    universalLink: 'https://app.binance.com/cedefi/ton-connect'
  },
  {
    appName: 'fintopio-tg',
    name: 'Fintopio',
    imageUrl: 'https://fintopio.com/tonconnect-icon.png',
    aboutUrl: 'https://fintopio.com',
    universalLink: 'https://t.me/fintopio?attach=wallet',
    bridgeUrl: 'https://wallet-bridge.fintopio.com/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'okxTonWallet',
    name: 'OKX Wallet',
    imageUrl: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
    aboutUrl: 'https://www.okx.com/web3',
    universalLink: 'https://www.okx.com/download?appendQuery=true&deeplink=okx://web3/wallet/tonconnect',
    jsBridgeKey: 'okxTonWallet',
    bridgeUrl: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
    platforms: ['chrome', 'safari', 'firefox', 'ios', 'android']
  },
  {
    appName: 'hot',
    name: 'HOT',
    imageUrl: 'https://raw.githubusercontent.com/hot-dao/media/main/logo.png',
    aboutUrl: 'https://hot-labs.org/',
    universalLink: 'https://t.me/herewalletbot?attach=wallet',
    jsBridgeKey: 'hotWallet',
    bridgeUrl: 'https://sse-bridge.hot-labs.org',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'bybitTonWallet',
    name: 'Bybit Wallet',
    imageUrl: 'https://raw.githubusercontent.com/bybit-web3/bybit-web3.github.io/main/docs/images/bybit-logo.png',
    aboutUrl: 'https://www.bybit.com/web3',
    universalLink: 'https://app.bybit.com/ton-connect',
    deepLink: 'bybitapp://',
    jsBridgeKey: 'bybitTonWallet',
    bridgeUrl: 'https://api-node.bybit.com/spot/api/web3/bridge/ton/bridge',
    platforms: ['ios', 'android', 'chrome']
  },
  {
    appName: 'dewallet',
    name: 'DeWallet',
    imageUrl: 'https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png',
    aboutUrl: 'https://delabwallet.com',
    universalLink: 'https://t.me/dewallet?attach=wallet',
    bridgeUrl: 'https://bridge.dewallet.pro/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'safepalwallet',
    name: 'SafePal',
    imageUrl: 'https://s.pvcliping.com/web/public_image/SafePal_x288.png',
    tondns: '',
    aboutUrl: 'https://www.safepal.com',
    universalLink: 'https://link.safepal.io/ton-connect',
    deepLink: 'safepal-tc://',
    jsBridgeKey: 'safepalwallet',
    bridgeUrl: 'https://ton-bridge.safepal.com/tonbridge/v1/bridge',
    platforms: ['ios', 'android', 'chrome', 'firefox']
  },
  {
    appName: 'GateWallet',
    name: 'GateWallet',
    imageUrl: 'https://img.gatedataimg.com/prd-ordinal-imgs/036f07bb8730716e/gateio-0925.png',
    aboutUrl: 'https://www.gate.io/',
    jsBridgeKey: 'gatetonwallet',
    bridgeUrl: 'https://dapp.gateio.services/tonbridge_api/bridge/v1',
    platforms: ['ios', 'android'],
    universalLink: 'https://gateio.go.link/gateio/web3?adj_t=1ff8khdw_1fu4ccc7'
  },
  {
    appName: 'openmask',
    name: 'OpenMask',
    imageUrl: 'https://raw.githubusercontent.com/OpenProduct/openmask-extension/main/public/openmask-logo-288.png',
    aboutUrl: 'https://www.openmask.app/',
    jsBridgeKey: 'openmask',
    platforms: ['chrome']
  },
  {
    appName: 'BitgetWeb3',
    name: 'BitgetWeb3',
    imageUrl: 'https://img.bitgetimg.com/image/third/1731638059795.png',
    aboutUrl: '​https://www.bitget.com',
    universalLink: 'https://t.me/BitgetOfficialBot?attach=wallet',
    bridgeUrl: 'https://ton-connect-bridge.bgwapi.io/bridge',
    platforms: ['ios', 'android', 'windows', 'macos', 'linux']
  },
  {
    appName: 'tobi',
    name: 'Tobi',
    imageUrl: 'https://app.tobiwallet.app/icons/logo-288.png',
    aboutUrl: 'https://tobi.fun',
    universalLink: 'https://t.me/TobiCopilotBot?attach=wallet',
    bridgeUrl: 'https://ton-bridge.tobiwallet.app/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'xtonwallet',
    name: 'XTONWallet',
    imageUrl: 'https://xtonwallet.com/assets/img/icon-256-back.png',
    aboutUrl: 'https://xtonwallet.com',
    jsBridgeKey: 'xtonwallet',
    platforms: ['chrome', 'firefox']
  },
  {
    appName: 'tonwallet',
    name: 'TON Wallet',
    imageUrl: 'https://wallet.ton.org/assets/ui/qr-logo.png',
    aboutUrl: 'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd',
    jsBridgeKey: 'tonwallet',
    platforms: ['chrome']
  },
  {
    appName: 'bitgetWalletLite',
    name: 'Bitget Wallet Lite',
    imageUrl:
      'https://raw.githubusercontent.com/bitgetwallet/download/refs/heads/main/logo/png/bitget_wallet_lite_logo_288.png',
    aboutUrl: 'https://web3.bitget.com',
    universalLink: 'https://t.me/BitgetWallet_TGBot?attach=wallet',
    bridgeUrl: 'https://ton-connect-bridge.bgwapi.io/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  },
  {
    appName: 'tomoWallet',
    name: 'Tomo Wallet',
    imageUrl: 'https://pub.tomo.inc/logo.png',
    aboutUrl: 'https://www.tomo.inc/',
    universalLink: 'https://t.me/tomowalletbot?attach=wallet',
    bridgeUrl: 'https://go-bridge.tomo.inc/bridge',
    platforms: ['ios', 'android', 'macos', 'windows', 'linux']
  }
];
