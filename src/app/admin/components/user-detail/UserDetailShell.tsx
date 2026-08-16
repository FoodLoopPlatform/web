"use client";

import React, { useState } from "react";
import { useAppLang } from "@/store/use-app-lang";
import {
  banUserPermanently,
  UserDetail,
  UserActivityEntry,
  getUserActivityEntries,
} from "../../api/user-detail-api";
import {
  updateUserStatus,
  verifyStore,
  verifyCharity,
  deleteReview,
  Review,
} from "../../api/admin-api";

import { UserDetailHeader } from "./UserDetailHeader";
import { UserProfileCard } from "./UserProfileCard";
import { StoreDocumentsCard } from "./StoreDocumentsCard";
import { StoreReviewsCard } from "./StoreReviewsCard";
import { PlatformActionsPanel } from "./PlatformActionsPanel";
import { SendNoteModal } from "../common/SendNoteModal";
import { UserActivityLog } from "./UserActivityLog";
import { UserDetailConfirmationModals } from "./UserDetailConfirmationModals";
import { UserDetailSkeleton } from "./UserDetailSkeleton";

interface UserDetailShellProps {
  id: string;
  initialUser?: UserDetail | null;
  initialActivities?: UserActivityEntry[];
  initialReviews?: Review[];
}

export function UserDetailShell({
  id,
  initialUser = null,
  initialActivities = [],
  initialReviews = [],
}: UserDetailShellProps) {
  const { lang } = useAppLang();
  const isRtl = lang === "ar";

  const [user, setUser] = useState<UserDetail | null>(initialUser);
  const [activities, setActivities] =
    useState<UserActivityEntry[]>(initialActivities);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "suspend" | "ban" | "approve" | "reject" | "reactivate" | null;
  }>({ isOpen: false, action: null });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler for deleting a store review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await deleteReview(reviewId);
      if (res?.error) {
        showToast(
          isRtl
            ? `حدث خطأ أثناء حذف التقييم: ${res.error}`
            : `Failed to delete review: ${res.error}`,
        );
        return;
      }
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast(isRtl ? "تم حذف التقييم بنجاح" : "Review deleted successfully");
    } catch {
      showToast(
        isRtl ? "حدث خطأ أثناء حذف التقييم" : "Failed to delete review",
      );
    }
  };

  // Handlers for platform actions with reason/notes
  const handleSuspendAction = async (reason?: string) => {
    if (!user) return;
    try {
      if (user.role === "Store") {
        await verifyStore(user.id, "Rejected", reason);
      } else if (user.role === "Charity") {
        await verifyCharity(user.id, "Rejected", reason);
      } else {
        await updateUserStatus(user.id, "SUSPENDED", reason);
      }
      setUser((prev: UserDetail | null) =>
        prev ? { ...prev, status: "SUSPENDED" } : null,
      );

      // Refetch latest activity log from endpoint
      const freshLogs = await getUserActivityEntries(user.id, user.role);
      if (freshLogs.data) {
        setActivities(freshLogs.data);
      }

      showToast(
        isRtl ? "تم تعطيل الحساب بنجاح" : "Account suspended successfully",
      );
    } catch {
      showToast(
        isRtl ? "حدث خطأ أثناء تعطيل الحساب" : "Failed to suspend account",
      );
    }
  };

  const handleReactivateAction = async (reason?: string) => {
    if (!user) return;
    try {
      if (user.role === "Store") {
        await verifyStore(user.id, "Approved", reason);
      } else if (user.role === "Charity") {
        await verifyCharity(user.id, "Approved", reason);
      } else {
        await updateUserStatus(user.id, "ACTIVE", reason);
      }
      setUser((prev: UserDetail | null) =>
        prev ? { ...prev, status: "ACTIVE" } : null,
      );

      // Refetch latest activity log from endpoint
      const freshLogs = await getUserActivityEntries(user.id, user.role);
      if (freshLogs.data) {
        setActivities(freshLogs.data);
      }

      showToast(
        isRtl
          ? "تم توثيق وتنشيط الحساب بنجاح"
          : "Account verified & reactivated successfully",
      );
    } catch {
      showToast(
        isRtl ? "حدث خطأ أثناء تنشيط الحساب" : "Failed to reactivate account",
      );
    }
  };

  const handleBanAction = async () => {
    if (!user) return;
    try {
      await banUserPermanently(user.id);
      setUser((prev: UserDetail | null) =>
        prev ? { ...prev, status: "SUSPENDED" } : null,
      );

      // Refetch latest activity log from endpoint
      const freshLogs = await getUserActivityEntries(user.id, user.role);
      if (freshLogs.data) {
        setActivities(freshLogs.data);
      }

      showToast(isRtl ? "تم حظر المستخدم بنجاح" : "User banned successfully");
    } catch {
      showToast(isRtl ? "حدث خطأ أثناء الحظر" : "Failed to ban user");
    }
  };

  // Handler for exporting log to CSV
  const handleExportLogs = () => {
    if (activities.length === 0) return;
    const headers = ["ID", "Type", "Title", "Description", "Timestamp"];
    const rows = activities.map((a) => [
      a.id,
      a.type,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.description.replace(/"/g, '""')}"`,
      a.timestamp,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `user_${id}_activity_log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) return <UserDetailSkeleton />;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-50 bg-on-surface text-white px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <UserDetailHeader userId={user.id} isRtl={isRtl} />

      {/* Top 2-Column Grid: Profile card (left 2/3) + Actions/Notes (right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UserProfileCard user={user} isRtl={isRtl} />
          {(user.role === "Store" || user.role === "Charity") && (
            <StoreDocumentsCard
              documents={user.documents}
              isRtl={isRtl}
              status={user.status}
              onApprove={() =>
                setConfirmModal({ isOpen: true, action: "approve" })
              }
              onReject={() =>
                setConfirmModal({ isOpen: true, action: "reject" })
              }
              isPendingVerification={user.status === "PENDING"}
            />
          )}
          {user.role === "Store" && (
            <StoreReviewsCard
              reviews={reviews}
              isLoading={false}
              isRtl={isRtl}
              onDeleteReview={handleDeleteReview}
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <PlatformActionsPanel
            userId={user.id}
            status={user.status}
            isRtl={isRtl}
            onSuspend={() =>
              setConfirmModal({ isOpen: true, action: "suspend" })
            }
            onBan={() => setConfirmModal({ isOpen: true, action: "ban" })}
            onReactivate={() =>
              setConfirmModal({ isOpen: true, action: "reactivate" })
            }
            onSendNote={() => setIsNoteModalOpen(true)}
          />
        </div>
      </div>

      {/* Bottom Section: Full Width Activity Log */}
      <UserActivityLog
        entries={activities}
        isLoading={false}
        isRtl={isRtl}
        onExport={handleExportLogs}
      />

      {/* Popup Note Modal */}
      <SendNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        targetId={user.id}
        targetName={user.name}
        targetRole={user.role}
        isRtl={isRtl}
        onNoteSent={() => {
          showToast(
            isRtl ? "تم إرسال وحفظ الملاحظة بنجاح" : "Note saved successfully",
          );
          setIsNoteModalOpen(false);
        }}
      />

      {/* Action Confirmation Modals with Reason/Notes */}
      <UserDetailConfirmationModals
        user={user}
        confirmModal={confirmModal}
        isRtl={isRtl}
        onClose={() => setConfirmModal({ isOpen: false, action: null })}
        onApprove={(reason) => handleReactivateAction(reason)}
        onSuspend={(reason) => handleSuspendAction(reason)}
        onReactivate={(reason) => handleReactivateAction(reason)}
        onBan={() => handleBanAction()}
      />
    </div>
  );
}
