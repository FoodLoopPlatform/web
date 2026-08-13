import React from "react";
import { Consumer, Store, Charity, AnalyticsSummary } from "./admin.types";

export type EntityType = "all" | "consumers" | "stores" | "charities";

export interface UserManagementShellProps {
  initialAnalytics?: AnalyticsSummary | null;
  initialConsumers?: Consumer[];
  initialStores?: Store[];
  initialCharities?: Charity[];
}

export interface UserManagementStatsProps {
  totalConsumers: number;
  totalStores: number;
  totalCharities: number;
  activeCount: number;
  isRtl?: boolean;
}

export interface UserManagementToolbarActionsProps {
  isRtl?: boolean;
  onEnroll: () => void;
  onExport: () => void;
}

export interface UserCardListProps {
  entities: (Consumer | Store | Charity)[];
  entityType: EntityType;
  isRtl?: boolean;
  onViewDetails: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export interface UserTableProps {
  entities: (Consumer | Store | Charity)[];
  entityType: EntityType;
  isRtl?: boolean;
  onViewDetails: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export interface EnrollFormState {
  name: string;
  email: string;
  location: string;
  extra: string;
}

export interface EnrollModalProps {
  isOpen: boolean;
  isRtl?: boolean;
  enrollForm: EnrollFormState;
  onClose: () => void;
  onChange: (updated: EnrollFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ActivityLogsDrawerProps {
  isOpen: boolean;
  isRtl?: boolean;
  onClose: () => void;
}
