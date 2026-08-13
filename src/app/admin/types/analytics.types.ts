import { AnalyticsSummary } from "./admin.types";

export interface AnalyticsShellProps {
  initialAnalytics?: AnalyticsSummary | null;
}

export interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
  isRtl?: boolean;
}

export interface TopEntityItem {
  id: string;
  nameAr: string;
  nameEn: string;
  metricLabelAr: string;
  metricLabelEn: string;
  metricValue: string | number;
  avatarUrl?: string;
}

export interface TopEntityListProps {
  titleAr: string;
  titleEn: string;
  items: TopEntityItem[];
  isRtl?: boolean;
}
