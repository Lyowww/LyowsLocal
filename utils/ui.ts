// utils/ui.ts

export const formatNumber = (num: number, skip?: 'K' | 'M' | 'B', fixed: number = 2) => {
  if (num >= 1000000000 && skip !== 'B') return `${(num / 1000000000).toFixed(fixed)}B`;
  if (num >= 1000000 && skip !== 'M') return `${(num / 1000000).toFixed(fixed)}M`;
  if (num >= 1000 && skip !== 'K') return `${(num / 1000).toFixed(fixed)}K`;
  return num.toFixed(0);
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

type TelegramWindow = Window &
  typeof globalThis & {
    Telegram?: {
      WebApp?: {
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
        };
      };
    };
  };

export function triggerHapticFeedback(
  telegramWebApp: TelegramWindow | Window = window,
  style: 'light' | 'medium' | 'heavy' = 'medium'
) {
  if (!telegramWebApp) return;

  const vibrationEnabled = localStorage.getItem('vibrationEnabled') !== 'false';
  if (!vibrationEnabled) return;

  const hapticFeedback = (telegramWebApp as TelegramWindow).Telegram?.WebApp?.HapticFeedback;
  if (hapticFeedback?.impactOccurred) {
    hapticFeedback.impactOccurred(style);
  }
}
