"use client";

import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { PlatformAdmin, AdminPermission } from "../../types/admin.types";

interface EditAdminModalProps {
  selectedAdmin: PlatformAdmin;
  editingRoleTitle: string;
  setEditingRoleTitle: (val: string) => void;
  editingPermissions: AdminPermission[];
  permissionList: { key: AdminPermission; label: string }[];
  isRtl: boolean;
  t: AdminDictionary;
  onClose: () => void;
  onPermissionToggle: (perm: AdminPermission) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({
  selectedAdmin,
  editingRoleTitle,
  setEditingRoleTitle,
  editingPermissions,
  permissionList,
  isRtl,
  t,
  onClose,
  onPermissionToggle,
  onSubmit,
}) => {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/55 flex items-center justify-center p-4"
      onClick={onClose}
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

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                      onChange={() => onPermissionToggle(p.key)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div
            className={`flex items-center gap-2 pt-2 justify-end ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <button
              type="button"
              onClick={onClose}
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
  );
};
