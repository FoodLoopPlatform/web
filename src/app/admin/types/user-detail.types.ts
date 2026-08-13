import { UserDetail, UserActivityEntry, StoreDocument } from "./admin.types";
import { Review } from "../api/admin-api";

export interface UserDetailShellProps {
  id: string;
  initialUser?: UserDetail | null;
  initialActivities?: UserActivityEntry[];
  initialReviews?: Review[];
}

export interface UserDetailHeaderProps {
  userId: string;
  isRtl?: boolean;
}

export interface UserProfileCardProps {
  user: UserDetail;
  isRtl?: boolean;
}

export interface StoreDocumentsCardProps {
  documents?: StoreDocument[];
  isRtl?: boolean;
  status?: string;
  onApprove?: () => void;
  onReject?: () => void;
  isPendingVerification?: boolean;
}

export interface StoreReviewsCardProps {
  reviews: Review[];
  isLoading?: boolean;
  isRtl?: boolean;
  onDeleteReview?: (reviewId: string) => void;
}

export interface PlatformActionsPanelProps {
  userId: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  isRtl?: boolean;
  onSuspend: () => void;
  onBan: () => void;
  onReactivate: () => void;
}

export interface UserActivityLogProps {
  entries: UserActivityEntry[];
  isLoading?: boolean;
  isRtl?: boolean;
  onExport?: () => void;
}

export interface ActivityLogEntryProps {
  entry: UserActivityEntry;
  isRtl?: boolean;
}

export type ConfirmActionType =
  "suspend" | "ban" | "approve" | "reject" | "reactivate" | null;

export interface ConfirmModalState {
  isOpen: boolean;
  action: ConfirmActionType;
}

export interface UserDetailConfirmationModalsProps {
  user: UserDetail;
  confirmModal: ConfirmModalState;
  isRtl?: boolean;
  onClose: () => void;
  onApprove: (reason?: string) => void;
  onSuspend: (reason?: string) => void;
  onReactivate: (reason?: string) => void;
  onBan: () => void;
}
