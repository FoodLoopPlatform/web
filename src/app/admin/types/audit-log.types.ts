import { AuditLogItem } from "./admin.types";

export interface AuditLogClientContainerProps {
  initialLogs?: AuditLogItem[];
  initialTotal?: number;
}

export interface AuditLogFilterState {
  action?: string;
  severity?: string;
  userRole?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogFiltersProps {
  onFilterChange: (filters: {
    searchQuery: string;
    action: string;
    severity: string;
    userRole: string;
    startDate: string;
    endDate: string;
  }) => void;
  isRtl?: boolean;
}

export interface AuditLogTableProps {
  logs: AuditLogItem[];
  isLoading?: boolean;
  isRtl?: boolean;
  onSelectLog: (log: AuditLogItem) => void;
}

export interface AuditLogsWidgetProps {
  logs: AuditLogItem[];
  isLoading?: boolean;
  isRtl?: boolean;
  onViewAll?: () => void;
}

export interface AuditDetailModalProps {
  log: AuditLogItem | null;
  isOpen: boolean;
  isRtl?: boolean;
  onClose: () => void;
}

export interface AuditEmptyStateProps {
  isRtl?: boolean;
  onResetFilters?: () => void;
}

export interface AuditStatsRowProps {
  logs: AuditLogItem[];
  totalCount: number;
  isRtl?: boolean;
}

export interface AuditActionBadgeProps {
  action: string;
  isRtl?: boolean;
}

export interface AuditSeverityBadgeProps {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  isRtl?: boolean;
}

export interface AuditFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalLogs: number;
  isRtl?: boolean;
}
