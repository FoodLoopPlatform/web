import React from "react";
import { AdminDictionary } from "../constants/dictionary";

interface AuditFooterProps {
  t: AdminDictionary;
  isRtl?: boolean;
}

export const AuditFooter: React.FC<AuditFooterProps> = ({
  t,
  isRtl = false,
}) => {
  return (
    <footer
      className={`w-full border-t border-card-border pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline ${
        isRtl ? "sm:flex-row-reverse" : ""
      }`}
    >
      <p className="font-medium text-center sm:text-left">
        {t.footerComplianceMsg}
      </p>
      <div
        className={`flex items-center gap-4 font-semibold ${
          isRtl ? "flex-row-reverse" : ""
        }`}
      >
        <a
          href="#privacy"
          onClick={(e) => e.preventDefault()}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          {t.privacyPolicy}
        </a>
        <span>·</span>
        <a
          href="#status"
          onClick={(e) => e.preventDefault()}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          {t.systemStatus}
        </a>
        <span>·</span>
        <a
          href="#support"
          onClick={(e) => e.preventDefault()}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          {t.supportLink}
        </a>
      </div>
    </footer>
  );
};
