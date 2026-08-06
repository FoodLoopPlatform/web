"use client";

import React, { useEffect, useState, use } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import {
  getUserDetail,
  getUserActivityEntries,
  banUserPermanently,
  UserDetail,
  UserActivityEntry,
} from "../../api/user-detail-api";
import {
  updateUserStatus,
  verifyStore,
  verifyCharity,
  getAdminReviews,
  deleteReview,
  Review,
} from "../../api/admin-api";

import { UserDetailHeader } from "../../components/UserDetailHeader";
import { UserProfileCard } from "../../components/UserProfileCard";
import { StoreDocumentsCard } from "../../components/StoreDocumentsCard";
import { StoreReviewsCard } from "../../components/StoreReviewsCard";
import { PlatformActionsPanel } from "../../components/PlatformActionsPanel";
import { UserActivityLog } from "../../components/UserActivityLog";
import { UserDetailConfirmationModals } from "../../components/UserDetailConfirmationModals";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang } = useAdminLang();
  const isRtl = lang === "ar";

  const [user, setUser] = useState<UserDetail | null>(null);
  const [activities, setActivities] = useState<UserActivityEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      try {
        const [userRes, actRes] = await Promise.all([
          getUserDetail(id),
          getUserActivityEntries(id),
        ]);

        if (userRes.data) {
          setUser(userRes.data);
          if (userRes.data.role === "Store") {
            setIsReviewsLoading(true);
            try {
              const revRes = await getAdminReviews({ storeId: id });
              if (revRes.data && Array.isArray(revRes.data)) {
                setReviews(revRes.data);
              }
            } catch (e) {
              console.error("Error loading store reviews:", e);
            } finally {
              setIsReviewsLoading(false);
            }
          }
        } else {
          // Fallback user structure if ID is unknown
          setUser({
            id,
            name: `User ${id}`,
            email: `user.${id.toLowerCase()}@foodloop.eg`,
            phone: "+20 (010) 000-0000",
            location: "Cairo, Egypt",
            joinedDate: "Jan 15, 2024",
            lastActive: "Active recently",
            status: "ACTIVE",
            role: "Store",
            stats: {
              totalSales: "EGP 12,400",
              fulfillmentRate: 90,
              activeDisputes: 0,
            },
          });

          setIsReviewsLoading(true);
          try {
            const revRes = await getAdminReviews({ storeId: id });
            if (revRes.data && Array.isArray(revRes.data)) {
              setReviews(revRes.data);
            }
          } catch (e) {
            console.error("Error loading store reviews:", e);
          } finally {
            setIsReviewsLoading(false);
          }
        }

        setActivities(actRes.data || []);
      } catch (err) {
        console.error("Error loading user details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [id]);

  // Handler for deleting a store review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
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
      setUser((prev) => (prev ? { ...prev, status: "SUSPENDED" } : null));

      // Refetch latest activity log from endpoint
      const freshLogs = await getUserActivityEntries(user.id);
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
      setUser((prev) => (prev ? { ...prev, status: "ACTIVE" } : null));

      // Refetch latest activity log from endpoint
      const freshLogs = await getUserActivityEntries(user.id);
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
      setUser((prev) => (prev ? { ...prev, status: "SUSPENDED" } : null));

      // Refetch latest activity log from endpoint
      const freshLogs = await getUserActivityEntries(user.id);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-outline font-semibold text-xs">
          <svg
            className="animate-spin h-5 w-5 text-primary-container"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {isRtl ? "جارٍ تحميل تفاصيل المستخدم..." : "Loading user details..."}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-white px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
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
              isLoading={isReviewsLoading}
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
