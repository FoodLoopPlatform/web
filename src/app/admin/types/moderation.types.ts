import { ModerationItem } from "./admin.types";

export type ModerationTab = "all" | "flagged" | "rejected";

export interface ModerationShellProps {
  initialItems?: ModerationItem[];
}

export interface ModerationFilterState {
  category: string;
  flagReason: string;
  storeSearch: string;
  minPrice: string;
  maxPrice: string;
}

export interface ModerationActionsProps {
  item: ModerationItem;
  isRtl?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export interface ModerationBadgeProps {
  status: "FLAGGED" | "APPROVED" | "REJECTED" | string;
  isRtl?: boolean;
}

export interface ModerationEmptyStateProps {
  activeTab: ModerationTab;
  isRtl?: boolean;
  onResetFilters?: () => void;
}

export interface ModerationFilterModalProps {
  isOpen: boolean;
  isRtl?: boolean;
  filters: ModerationFilterState;
  onClose: () => void;
  onApply: (filters: ModerationFilterState) => void;
  onReset: () => void;
}

export interface ModerationFlagBadgeProps {
  flagReason?: string;
  isRtl?: boolean;
}

export interface ModerationListingCardProps {
  item: ModerationItem;
  isRtl?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export interface ModerationPageHeaderProps {
  isRtl?: boolean;
  onOpenFilter: () => void;
}

export interface ModerationStatItemProps {
  label: string;
  value: number;
  isRtl?: boolean;
}
