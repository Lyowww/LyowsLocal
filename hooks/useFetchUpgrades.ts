// hooks/useFetchUpgrades.ts

import { UpgradeItem } from '@/utils/types';
import { useState, useEffect } from 'react';

const useFetchUpgrades = (): { upgrades: UpgradeItem[]; isLoading: boolean } => {
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUpgradeItems = async (): Promise<void> => {
      try {
        const response = await fetch('/api/upgrade/skill');
        if (!response.ok) {
          throw new Error('Failed to fetch upgrade items');
        }
        const data = await response.json();
        setUpgrades(data.upgrades);
      } catch (error) {
        console.error('Error fetching upgrade items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpgradeItems();
  }, []);

  return { upgrades, isLoading };
};

export default useFetchUpgrades;
