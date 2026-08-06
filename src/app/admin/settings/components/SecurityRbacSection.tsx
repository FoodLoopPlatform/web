"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminDictionary } from "../../constants/dictionary";
import {
  PlatformAdmin,
  AdminPermission,
  SecuritySettings,
} from "../../types/admin.types";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import {
  ShieldCheckIcon,
  UserIcon,
  EditIcon,
  PlusIcon,
  ClockIcon,
} from "@/components/icons";

interface SecurityRbacSectionProps {
  admins: PlatformAdmin[];
  securitySettings: SecuritySettings;
  t: AdminDictionary;
  isRtl?: boolean;
  currentAdminPermissions?: AdminPermission[];
  onUpdateAdmin: (
    id: string,
    permissions: AdminPermission[],
    roleTitle: string,
  ) => void;
  onUpdateSecuritySettings: (settings: SecuritySettings) => void;
}

export const SecurityRbacSection: React.FC<SecurityRbacSectionProps> = ({
  admins,
  securitySettings,
  t,
  isRtl = false,
  currentAdminPermissions = [
    "can_resolve_disputes",
    "can_edit_system_caps",
    "can_ban_users",
    "can_manage_roles",
    "can_manage_rag_docs",
    "can_view_analytics",
  ],
  onUpdateAdmin,
  onUpdateSecuritySettings,
}) => {
  const canManageRoles = currentAdminPermissions.includes("can_manage_roles");

  const [selectedAdmin, setSelectedAdmin] = useState<PlatformAdmin | null>(
    null,
  );
  const [editingPermissions, setEditingPermissions] = useState<
    AdminPermission[]
  >([]);
  const [editingRoleTitle, setEditingRoleTitle] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [secData, setSecData] = useState<SecuritySettings>({
    ...securitySettings,
  });

  const handleEditClick = (admin: PlatformAdmin) => {
    if (!canManageRoles) return;
    setSelectedAdmin(admin);
    setEditingPermissions([...admin.permissions]);
    setEditingRoleTitle(admin.roleTitle);
  };

  const handlePermissionToggle = (perm: AdminPermission) => {
    setEditingPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const handleSaveAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmAdminSave = () => {
    if (selectedAdmin) {
      onUpdateAdmin(
        selectedAdmin.id,
        editingPermissions,
        editingRoleTitle || selectedAdmin.roleTitle,
      );
      setSelectedAdmin(null);
    }
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSecuritySettings(secData);
  };

  const permissionList: { key: AdminPermission; label: string }[] = [
    { key: "can_resolve_disputes", label: t.canResolveDisputes },
    { key: "can_edit_system_caps", label: t.canEditSystemCaps },
    { key: "can_ban_users", label: t.canBanUsers },
    { key: "can_manage_roles", label: t.canManageRoles },
    { key: "can_manage_rag_docs", label: t.canManageRagDocs },
    { key: "can_view_analytics", label: t.canViewAnalytics },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Platform Administrative RBAC Matrix */}
      <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            className={`flex items-center gap-3 ${isRtl ? "text-right" : "text-left"}`}
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-primary font-brand">
                {t.tabSecurityRbac}
              </h3>
              <p className="text-xs text-outline font-medium">
                {t.authorizedAdminsSub}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!canManageRoles}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              canManageRoles
                ? "bg-primary hover:bg-primary/90 text-on-primary cursor-pointer"
                : "bg-surface-container text-outline opacity-60 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="w-4 h-4" />
            <span>{t.inviteAdminBtn}</span>
          </button>
        </div>

        {!canManageRoles && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isRtl
                ? "تنبيه الصلاحيات: حسابك الحالي لا يمتلك صلاحية 'إدارة الأدوار' لتعديل مصفوفات التحكم."
                : "Permission Warning: Your account lacks 'Can Manage Roles' privilege to alter admin permissions."}
            </span>
          </div>
        )}

        <div className="overflow-x-auto border border-card-border rounded-xl">
          <table
            className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
          >
            <thead>
              <tr className="bg-surface border-b border-card-border">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.adminNameCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.adminRoleCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.permissionsCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.adminStatusCol}
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-outline text-center whitespace-nowrap">
                  {t.actionsCol}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {admins.map((adm) => {
                const isActive = adm.status === "ACTIVE";
                return (
                  <tr
                    key={adm.id}
                    className="hover:bg-surface/60 transition-colors"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">
                            {adm.name}
                          </span>
                          <span className="text-[10px] text-outline">
                            {adm.email} • {adm.lastActive}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap text-xs">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-surface-container text-primary border border-outline-variant/40">
                        {adm.roleTitle}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap text-xs">
                      <div className="flex flex-wrap gap-1 max-w-[320px]">
                        {adm.permissions.map((pKey) => {
                          const pObj = permissionList.find(
                            (p) => p.key === pKey,
                          );
                          return (
                            <span
                              key={pKey}
                              className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary"
                            >
                              {pObj?.label || pKey}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap text-xs">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isActive
                            ? "text-green-600 bg-green-50"
                            : "text-outline bg-surface-container"
                        }`}
                      >
                        ● {isActive ? t.active : t.pending}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={() => handleEditClick(adm)}
                        disabled={!canManageRoles}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          canManageRoles
                            ? "hover:bg-surface-container text-outline hover:text-primary"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        title={isRtl ? "تعديل الصلاحيات" : "Edit permissions"}
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Audit Log Retention Settings Policy */}
      <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6">
        <div
          className={`flex items-center gap-3 ${isRtl ? "text-right" : "text-left"}`}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary font-brand">
              {t.auditRetentionLabel}
            </h3>
            <p className="text-xs text-outline font-medium">
              {t.auditRetentionSub}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSecuritySave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.auditRetentionLabel}
            </label>
            <select
              value={secData.auditLogRetentionDays}
              onChange={(e) =>
                setSecData((prev) => ({
                  ...prev,
                  auditLogRetentionDays: parseInt(
                    e.target.value,
                    10,
                  ) as SecuritySettings["auditLogRetentionDays"],
                }))
              }
              className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value={90}>
                {isRtl
                  ? "٩٠ يوماً (الحد الأدنى اللوجستي)"
                  : "90 Days (Logistics Minimum)"}
              </option>
              <option value={180}>
                {isRtl ? "١٨٠ يوماً (موصى به)" : "180 Days (Recommended)"}
              </option>
              <option value={365}>
                {isRtl ? "سنة كاملة (٣٦٥ يوماً)" : "1 Full Year (365 Days)"}
              </option>
              <option value={-1}>
                {isRtl
                  ? "حفظ دائم دون أرشفة تلقائية"
                  : "Permanent (No Auto Archive)"}
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.sessionTimeoutLabel}
            </label>
            <input
              type="number"
              min={5}
              max={240}
              value={secData.sessionTimeoutMinutes}
              onChange={(e) =>
                setSecData((prev) => ({
                  ...prev,
                  sessionTimeoutMinutes: parseInt(e.target.value, 10) || 30,
                }))
              }
              className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-surface-container">
            <Link
              href="/admin/audit-log"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
            >
              <span>{t.linkAuditLogPage}</span>
            </Link>

            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {t.saveBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Admin Modal */}
      {selectedAdmin && (
        <div
          className="fixed inset-0 z-[9999] bg-black/55 flex items-center justify-center p-4"
          onClick={() => setSelectedAdmin(null)}
        >
          <div
            className={`bg-white rounded-2xl p-6 w-full max-w-[500px] shadow-2xl flex flex-col gap-4 ${
              isRtl ? "text-right" : "text-left"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-surface-container pb-3">
              <h3 className="text-sm font-extrabold text-on-surface">
                {isRtl
                  ? `تعديل صلاحيات: ${selectedAdmin.name}`
                  : `Edit Admin: ${selectedAdmin.name}`}
              </h3>
              <p className="text-[11px] text-outline mt-0.5">
                {selectedAdmin.email}
              </p>
            </div>

            <form
              onSubmit={handleSaveAdminSubmit}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  {t.adminRoleCol}
                </label>
                <input
                  type="text"
                  required
                  value={editingRoleTitle}
                  onChange={(e) => setEditingRoleTitle(e.target.value)}
                  placeholder="e.g. Platform Controller, Compliance Officer..."
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">
                  {t.permissionsCol}
                </label>
                <div className="flex flex-col gap-2 bg-surface p-3 rounded-xl border border-outline-variant/40">
                  {permissionList.map((p) => {
                    const isChecked = editingPermissions.includes(p.key);
                    return (
                      <label
                        key={p.key}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold text-on-surface">
                          {p.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(p.key)}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div
                className={`flex items-center gap-2 pt-2 justify-end ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedAdmin(null)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={t.confirmRoleUpdateTitle}
        message={t.confirmRoleUpdateMsg}
        confirmLabel={t.saveBtn}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="warning"
        isRtl={isRtl}
        onConfirm={handleConfirmAdminSave}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
