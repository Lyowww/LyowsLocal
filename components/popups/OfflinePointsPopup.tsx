// components/popups/OfflinePointsPopup.tsx



'use client';

import React from 'react';
import Image from 'next/image';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { JOK_POINTS_UP } from '@/images';
import { useTranslations } from 'next-intl';

interface OfflinePointsPopupProps {
  earnedPoints: number;
  onClose: () => void;
  handleViewChange: (view: string) => void;
  isClosing: boolean;
  setIsClosing: (value: boolean) => void;
}

const OfflinePointsPopup: React.FC<OfflinePointsPopupProps> = React.memo(({ earnedPoints, onClose, handleViewChange, isClosing, setIsClosing }) => {
  const t = useTranslations('OfflinePointsPopup');

  const handleClose = () => {
    triggerHapticFeedback(window);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className={`relative bg-[#272a2f] rounded-3xl p-6 w-full max-w-xl ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="w-8"></div>
          <h2 className="text-3xl text-white text-center font-bold">{t('title')}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <p className="text-gray-300 text-center mb-4">{t('message')}</p>
        <p className="text-gray-300 text-center mb-4">{t('message2')}</p>
        <div className="flex justify-center mb-4">
          <button
            className="w-fit px-6 py-3 text-xl font-bold bg-blue-500 text-white rounded-2xl"
            onClick={() => {
              handleViewChange('shop');
              handleClose();
            }}
          >
            {t('cta')}
          </button>
        </div>
        <div className="flex justify-center items-center mb-4">
          <Image src={JOK_POINTS_UP} alt="JOK Points" width={24} height={24} className="w-6 h-6" />
          <span className="text-white font-bold text-2xl ml-1">+{earnedPoints ? formatNumber(earnedPoints) : ''}</span>
        </div>
        <button
          className="w-full py-6 text-xl font-bold bg-green-500 text-white rounded-2xl flex items-center justify-center"
          onClick={handleClose}
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
});


export default OfflinePointsPopup;