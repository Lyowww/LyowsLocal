// components/popups/StarSelectionPopup.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/utils/game-mechanics';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { useTranslations } from 'next-intl';
import { ShopItem } from '@/utils/types';

interface StarSelectionPopupProps {
  onClose: () => void;
  onConfirm: (stars: number) => void;
  selectedItem?: ShopItem; // Optional for topup mode
  mode: 'spend' | 'topup';  // New mode prop to determine behavior
  maxStars?: number;        // Optional max stars for topup mode
  title?: string;           // Optional custom title
}

const StarSelectionPopup: React.FC<StarSelectionPopupProps> = React.memo(({
  onClose,
  onConfirm,
  selectedItem,
  mode = 'spend',
  maxStars = 1000,
  title
}) => {
  const t = useTranslations('StarSelectionPopup');
  const { totalStars } = useGameStore();

  const [selectedStars, setSelectedStars] = useState(mode === 'spend' ? 0 : 100);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    triggerHapticFeedback(window);
    setIsClosing(true);
    setTimeout(onClose, 280);
  };

  const handleConfirm = (stars: number) => {
    try {
      setLoading(true);
      onConfirm(stars);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (mode === 'spend') {
      // For spending, limit by total stars and item price
      const itemPrice = selectedItem ? selectedItem.price : 0;
      const max = totalStars > itemPrice ? itemPrice : totalStars;
      setSelectedStars(value > max ? max : value);
    } else {
      // For topup, just use the selected value up to maxStars
      setSelectedStars(value > maxStars ? maxStars : value);
    }
  };

  // Determine max value based on mode
  const maxValue = mode === 'spend'
    ? (selectedItem && totalStars > selectedItem.price ? selectedItem.price : totalStars)
    : maxStars;

  // Default titles based on mode
  const defaultTitle = mode === 'spend'
    ? "Do you want to utilize stars from your account?"
    : "How many stars would you like to add?";

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50'>
      <div className={`bg-[#272a2f] rounded-3xl p-6 w-full max-w-xl ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <div className='relative'>
          <button
            onClick={handleClose}
            className='absolute top-0 right-0 w-6 h-6 aspect-square text-white bg-customGreen-700 rounded-full'
          >
            &times;
          </button>

          <div className={`flex justify-between items-center mb-4`}>
            <div className='w-8'></div>
            <h2 className={`text-xl text-white text-center font-bold`}>
              {title || defaultTitle}
            </h2>
            <div className='w-8'></div>
          </div>

          {mode === 'spend' && (
            <div className='flex justify-center items-center mb-4'>
              <Image src={'/star.png'} alt={'Stars'} width={24} height={24} className='w-6 h-6' />
              <span className='text-white font-bold text-2xl ml-1'>{formatNumber(totalStars)}</span>
              <span className='text-white font-bold text-base ml-1'>available in account</span>
            </div>
          )}

          <div className='w-full mb-6'>
            <div className='flex justify-between mb-2'>
              <span className='text-white text-sm'>
                {mode === 'spend' ? 'Stars to use:' : 'Stars to add:'}
              </span>
              <span className='text-white text-sm'>{selectedStars}</span>
            </div>
            <input
              type='range'
              min={mode === 'spend' ? 0 : 10} // Minimum for topup is 10 stars
              max={maxValue}
              value={selectedStars}
              onChange={handleStarChange}
              className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-customGreen-700'
            />
            <div className='flex justify-between mt-1'>
              <span className='text-xs text-gray-400'>{mode === 'spend' ? 0 : 10}</span>
              <span className='text-xs text-gray-400'>{maxValue}</span>
            </div>
          </div>

          <div className={`flex justify-between items-center gap-2 mb-4`}>
            <button
              className="w-full py-4 text-lg font-bold bg-gray-500 text-white rounded-2xl flex items-center justify-center"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className={`w-full py-4 text-lg font-bold bg-customGreen-700 text-white rounded-2xl flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleConfirm(selectedStars)}
              disabled={loading}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StarSelectionPopup;