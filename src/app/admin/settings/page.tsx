"use client";

import React, { useState, useEffect } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import { adminDictionary } from "../constants/dictionary";

export default function SystemSettingsPage() {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];

  const [toastMessage, setToastMessage] = useState("");

  // Settings states
  const [featureFlags, setFeatureFlags] = useState({
    autoVerifyStores: false,
    instapaySettlements: true,
    bulkUploads: true,
  });

  const [thresholds, setThresholds] = useState({
    commissionRate: "10",
    rateLimit: "120",
  });

  // Admin users state
  const admins = [
    { name: t.mainController, email: "admin@foodloop.eg", role: t.seniorControllerRole, status: t.active },
    { name: t.sarahAdmin, email: "sarah@foodloop.eg", role: t.controllerRole, status: t.active },
    { name: t.mikeAdmin, email: "mike@foodloop.eg", role: t.opsRole, status: t.active }
  ];



  const handleToggleFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const flagLabels = {
        autoVerifyStores: t.autoVerifyLabel,
        instapaySettlements: t.instapayLabel,
        bulkUploads: t.bulkLabel
      };
      showToast(t.featureUpdateSuccess.replace("{flag}", flagLabels[key]));
      return updated;
    });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t.saveSuccess);
  };

  const handleResetDb = () => {
    if (confirm(t.confirmReset)) {
      // resetAdminDb();
      showToast(t.resetSuccess);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-[1200px] mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 ${lang === "ar" ? "right-6" : "left-6"} bg-[#005129] border border-[#7dc390] text-white px-5 py-3.5 rounded-xl shadow-lg z-50 text-xs font-bold animate-in slide-in-from-bottom duration-250 flex items-center gap-2`}>
          <svg className="w-4 h-4 text-[#7dc390]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className={lang === "ar" ? "text-right" : "text-left"}>
        <h1 className="text-2xl sm:text-3xl font-bold font-brand tracking-tight text-[#00381a] serif-ish">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#707a70] mt-1 sm:mt-1.5 font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Settings Forms (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          
          {/* Feature Flags Block */}
          <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-4">
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h3 className="text-base font-extrabold text-[#00381a] font-brand">{t.systemFeatures}</h3>
              <span className="text-[10px] text-[#707a70] font-medium block mt-0.5">{t.systemFeaturesSub}</span>
            </div>

            <div className="divide-y divide-[#eeeee9] mt-2">
              <div className={`py-4 flex justify-between items-center ${lang === "ar" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex flex-col gap-0.5 ${lang === "ar" ? "items-start text-right" : "items-end text-left"}`}>
                  <span className="text-xs font-bold text-[#1a1c19]">{t.autoVerifyLabel}</span>
                  <span className="text-[10px] text-[#707a70]">{t.autoVerifySub}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFlag("autoVerifyStores")}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    featureFlags.autoVerifyStores ? "bg-[#005129]" : "bg-[#eeeee9]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    featureFlags.autoVerifyStores 
                      ? (lang === "ar" ? "right-1" : "left-6") 
                      : (lang === "ar" ? "right-6" : "left-1")
                  }`} />
                </button>
              </div>

              <div className={`py-4 flex justify-between items-center ${lang === "ar" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex flex-col gap-0.5 ${lang === "ar" ? "items-start text-right" : "items-end text-left"}`}>
                  <span className="text-xs font-bold text-[#1a1c19]">{t.instapayLabel}</span>
                  <span className="text-[10px] text-[#707a70]">{t.instapaySub}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFlag("instapaySettlements")}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    featureFlags.instapaySettlements ? "bg-[#005129]" : "bg-[#eeeee9]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    featureFlags.instapaySettlements 
                      ? (lang === "ar" ? "right-1" : "left-6") 
                      : (lang === "ar" ? "right-6" : "left-1")
                  }`} />
                </button>
              </div>

              <div className={`py-4 flex justify-between items-center ${lang === "ar" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex flex-col gap-0.5 ${lang === "ar" ? "items-start text-right" : "items-end text-left"}`}>
                  <span className="text-xs font-bold text-[#1a1c19]">{t.bulkLabel}</span>
                  <span className="text-[10px] text-[#707a70]">{t.bulkSub}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFlag("bulkUploads")}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    featureFlags.bulkUploads ? "bg-[#005129]" : "bg-[#eeeee9]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    featureFlags.bulkUploads 
                      ? (lang === "ar" ? "right-1" : "left-6") 
                      : (lang === "ar" ? "right-6" : "left-1")
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Threshold Form */}
          <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-4">
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h3 className="text-base font-extrabold text-[#00381a] font-brand">{t.operationalParams}</h3>
              <span className="text-[10px] text-[#707a70] font-medium block mt-0.5">{t.operationalParamsSub}</span>
            </div>

            <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2 text-xs font-medium">
              <div className={lang === "ar" ? "text-right" : "text-left"}>
                <label className="block text-[#404941] mb-1.5 font-bold uppercase tracking-wider">{t.commissionLabel}</label>
                <input
                  type="number"
                  required
                  className={`w-full px-3 py-2.5 rounded-lg border border-[#bfc9be] focus:outline-none focus:ring-1 focus:ring-[#266b40] focus:border-[#266b40] bg-[#fafaf4] ${
                    lang === "ar" ? "text-right" : "text-left"
                  }`}
                  value={thresholds.commissionRate}
                  onChange={(e) => setThresholds({ ...thresholds, commissionRate: e.target.value })}
                />
              </div>

              <div className={lang === "ar" ? "text-right" : "text-left"}>
                <label className="block text-[#404941] mb-1.5 font-bold uppercase tracking-wider">{t.rateLimitLabel}</label>
                <input
                  type="number"
                  required
                  className={`w-full px-3 py-2.5 rounded-lg border border-[#bfc9be] focus:outline-none focus:ring-1 focus:ring-[#266b40] focus:border-[#266b40] bg-[#fafaf4] ${
                    lang === "ar" ? "text-right" : "text-left"
                  }`}
                  value={thresholds.rateLimit}
                  onChange={(e) => setThresholds({ ...thresholds, rateLimit: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="col-span-1 sm:col-span-2 bg-[#005129] hover:bg-[#02522a] text-white py-3 rounded-lg font-bold transition-all text-xs cursor-pointer shadow-sm active:scale-95 mt-2"
              >
                {t.saveBtn}
              </button>
            </form>
          </div>

          {/* Admin Accounts List */}
          <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-4">
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h3 className="text-base font-extrabold text-[#00381a] font-brand">{t.authorizedAdmins}</h3>
              <span className="text-[10px] text-[#707a70] font-medium block mt-0.5">{t.authorizedAdminsSub}</span>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className={`w-full border-collapse ${lang === "ar" ? "text-right" : "text-left"}`}>
                <thead>
                  <tr className="bg-[#fafaf4] border-b border-[#e0e6df]">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">{t.adminNameCol}</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">{t.adminEmailCol}</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">{t.adminRoleCol}</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">{t.adminStatusCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeee9]">
                  {admins.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-[#fafaf4]/60 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-bold text-[#1a1c19] whitespace-nowrap">{adm.name}</td>
                      <td className="px-4 py-3.5 text-xs text-[#707a70] whitespace-nowrap">{adm.email}</td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                        <span className="text-[9px] bg-[#eeeee9] text-[#00381a] px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                          {adm.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-green-600 font-extrabold whitespace-nowrap">● {adm.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column Panels */}
        <div className="flex flex-col gap-6">
          
          {/* Smart Recommendation Card */}
          <div className="bg-[#005129] text-white p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-elevation-2 relative overflow-hidden">
            <div className={`flex gap-4 items-start z-10 ${lang === "ar" ? "flex-row text-right" : "flex-row-reverse text-left"}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#7dc390]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-extrabold tracking-tight font-brand text-[#7dc390]">{t.dbTool}</h4>
                <h3 className="text-base font-bold leading-snug mt-1">{t.dbToolTitle}</h3>
                <p className="text-xs text-[#bfc9be] leading-relaxed mt-2">
                  {t.dbToolDesc}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleResetDb}
              className={`mt-6 bg-[#ba1a1a] hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 z-10 border border-red-500 ${
                lang === "ar" ? "self-start" : "self-end"
              }`}
            >
              {t.dbResetBtn}
            </button>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm">
            <h3 className={`text-sm font-extrabold text-[#00381a] pb-4 border-b border-[#eeeee9] ${
              lang === "ar" ? "text-right" : "text-left"
            }`}>{t.settingsLog}</h3>
            <p className="mt-4 text-center text-xs text-[#707a70] py-6">
              {lang === "ar" ? "لا يتوفر سجل إعدادات حالياً." : "No settings logs available yet."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
