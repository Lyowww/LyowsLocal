// utils/types.ts.ts

import { TaskAction } from '@prisma/client';

export type IconProps = {
  size?: number;
  className?: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  points?: number;
  rewardStars?: number;
  multiplier?: number;
  type: string;
  image: string;
  partnerImage: string;
  callToAction: string;
  taskData: any;
  taskStartTimestamp: Date | null;
  isCompleted: boolean;
  isActive: boolean;
  taskAction: TaskAction;
  taskActionId: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  basePoints: number;
  category: string;
  subcategory: string;
  image: string;
  srNo: string;
  unlockRequirements?: string;
  requiredBy?: string;
}

export interface UserUpgrade {
  acquiredAt: Date;
  id: string;
  level: number;
  upgradeId: string;
  userId: string;
  cooldownEndsAt?: Date;
}

export interface TaskPopupProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isBasic: boolean;
  level?: number;
  invoiceUrl?: string;
  boostDuration?: number;
  boostType?: string;
  boostMultiplier?: number;
}

export interface InvoiceItem {
  name: string;
  description: string;
  prices: { label: string; amount: number }[];
  payload?: string;
  provider_token?: string;
  currency?: string;
}
