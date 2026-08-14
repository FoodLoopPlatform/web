import React from "react";

export interface NavItem {
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ReactNode;
}

export interface AdminShellProps {
  children: React.ReactNode;
}

export interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  isRtl?: boolean;
}

export interface TabSwitcherProps<T extends string = string> {
  tabs: { id: T; label: string; count?: number }[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  isRtl?: boolean;
}

export interface SearchToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholderAr?: string;
  placeholderEn?: string;
  isRtl?: boolean;
  filterButton?: React.ReactNode;
  actionButtons?: React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  isRtl?: boolean;
}

export interface SmartInsightCardProps {
  title: string;
  heading: string;
  bodyText: string;
  actionLabel: string;
  onActionClick: () => void;
  isRtl?: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  isRtl?: boolean;
}
