import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { shopImageMap } from '@/images';
import { ShopItem } from '@/utils/types';
import { formatNumber } from '@/utils/ui';
import { memo, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ShopViewProps {
  items: ShopItem[];
  handleBuyItem: (item: ShopItem) => Promise<void>;
}

const ItemButton = memo(
  ({
    item,
    handleBuyItem,
    isLoading,
    isPurchasing
  }: {
    item: ShopItem;
    handleBuyItem: (item: ShopItem) => Promise<void>;
    isLoading: boolean;
    isPurchasing: boolean;
  }) => {
    return (
      <div className='bg-gradient-to-b from-[#000000] to-[#666666] bg-clip-border p-px rounded-full'>
        <button
          onClick={() => handleBuyItem(item)}
          disabled={isLoading || isPurchasing}
          className={`w-full flex items-center justify-center gap-[5px] bg-gradient-to-tr from-[#000000] to-[#666666] pl-[7px] pr-[10px] py-[3px] rounded-full transition-opacity ${isLoading || isPurchasing ? 'opacity-50 cursor-not-allowed' : ' '}`}
        >
          {isLoading ? (
            <Loader2 className='w-3 h-3 animate-spin' />
          ) : (
            <Image src={'/star.png'} alt='Telegram Star' width={11} height={11} />
          )}
          <p className='text-xs font-medium text-white'>{formatNumber(item.price)}</p>
        </button>
      </div>
    );
  }
);

const ItemDetails = memo(
  ({
    item,
    handleBuyItem,
    isLoading,
    isPurchasing
  }: {
    item: ShopItem;
    handleBuyItem: (item: ShopItem) => Promise<void>;
    isLoading: boolean;
    isPurchasing: boolean;
  }) => {
    const t = useTranslations('Shop');
    return (
      <div className='flex items-start gap-6'>
        <Image
          src={shopImageMap[item.image]}
          alt={item.name}
          className={`${item.category === 'BOOST' ? 'w-[97px] h-[97px]' : 'w-[64px] h-[64px]'} rounded-lg`}
        />
        <div className='flex flex-col gap-2 flex-grow'>
          <div className='flex gap-[10px] justify-between'>
            <p
              className={`text-left ${item.category === 'BOOST' ? 'text-base' : 'text-sm'
                } text-white font-medium text-pretty`}
            >
              {t(item.name)}
            </p>
            <div>
              <ItemButton item={item} handleBuyItem={handleBuyItem} isLoading={isLoading} isPurchasing={isPurchasing} />
            </div>
          </div>
          <span
            className={`font-medium ${item.category === 'BOOST' ? 'text-sm' : 'text-xs'
              } text-[#9C9C9C] text-left text-pretty`}
          >
            {t(item.description)}
          </span>
        </div>
      </div>
    );
  }
);

const ShopItemCard = memo(
  ({
    item,
    handleBuyItem,
    isLoading,
    isPurchasing
  }: {
    item: ShopItem;
    handleBuyItem: (item: ShopItem) => Promise<void>;
    isLoading: boolean;
    isPurchasing: boolean;
  }) => {
    return (
      <div className='w-full flex justify-between items-center bg-[#080808] border border-[#2D2D2D] rounded-2xl p-[10px] relative gap-4'>
        <ItemDetails item={item} handleBuyItem={handleBuyItem} isLoading={isLoading} isPurchasing={isPurchasing} />
      </div>
    );
  }
);

export default function ShopView({ items, handleBuyItem }: ShopViewProps) {
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const buyItem = async (item: ShopItem) => {
    if (processingItemId) return;

    setProcessingItemId(item.id);
    try {
      await handleBuyItem(item);
    } finally {
      setProcessingItemId(null);
    }
  };

  const isPurchasing = processingItemId !== null;

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <ShopItemCard
          key={item.id}
          item={item}
          handleBuyItem={buyItem}
          isLoading={processingItemId === item.id}
          isPurchasing={isPurchasing}
        />
      ))}
    </div>
  );
}
