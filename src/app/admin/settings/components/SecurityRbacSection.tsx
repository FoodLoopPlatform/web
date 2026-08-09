"use client";

import React, { useState } from "react";
import { AdminDictionary } from "../../constants/dictionary";
import {
  PlatformAdmin,
  AdminPermission,
  SecuritySettings,
} from "../../types/admin.types";
import { ConfirmationModal } from "../../components";
import {
  ShieldCheckIcon,
  UserIcon,
  EditIcon,
  PlusIcon,
} from "@/components/icons";
import { EditAdminModal } from "./EditAdminModal";
import { AuditLogRetentionCard } from "./AuditLogRetentionCard";

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
              <h3 className="text-base font-extrabold text-primary font-sans">
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

      {/* Audit Log Retention Policy Component */}
      <AuditLogRetentionCard
        securitySettings={securitySettings}
        t={t}
        isRtl={isRtl}
        onUpdateSecuritySettings={onUpdateSecuritySettings}
      />

      {/* Edit Admin Modal */}
      {selectedAdmin && (
        <EditAdminModal
          selectedAdmin={selectedAdmin}
          editingRoleTitle={editingRoleTitle}
          setEditingRoleTitle={setEditingRoleTitle}
          editingPermissions={editingPermissions}
          permissionList={permissionList}
          isRtl={isRtl}
          t={t}
          onClose={() => setSelectedAdmin(null)}
          onPermissionToggle={handlePermissionToggle}
          onSubmit={handleSaveAdminSubmit}
        />
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
