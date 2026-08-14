"use client";

import React, { useEffect, useState } from "react";
import { Pulse, ShieldCheck, Users, Coins, ClipboardText, ClockCountdown } from "@phosphor-icons/react";

interface Summary {
  today: number;
  admins: number;
  members: number;
  security: number;
  investment: number;
  application: number;
}

export function ActivitySummary() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/admin/activity?summary=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSummary(d.summary);
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "TODAY",
      value: summary?.today ?? "—",
      sub: "events",
      icon: ClockCountdown,
      color: "text-blue-600 dark:text-[#6B93FF]",
      bg: "bg-blue-50 dark:bg-[#17233D]",
    },
    {
      label: "ADMINS",
      value: summary?.admins ?? "—",
      sub: "actions",
      icon: ShieldCheck,
      color: "text-amber-600 dark:text-[#F3B85B]",
      bg: "bg-amber-50 dark:bg-[#302714]",
    },
    {
      label: "MEMBERS",
      value: summary?.members ?? "—",
      sub: "actions",
      icon: Users,
      color: "text-emerald-600 dark:text-[#32C98B]",
      bg: "bg-emerald-50 dark:bg-[#102C22]",
    },
    {
      label: "SECURITY",
      value: summary?.security ?? "—",
      sub: "events",
      icon: Pulse,
      color: "text-rose-600 dark:text-[#FF6B6B]",
      bg: "bg-rose-50 dark:bg-[#32191B]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-4 flex items-center gap-3 shadow-2xs"
        >
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={color} weight="bold" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 dark:text-[#626A75] uppercase tracking-wider">{label}</p>
            <p className={`text-xl font-black leading-none ${color}`}>
              {value}
              <span className="text-xs font-bold text-slate-400 dark:text-[#626A75] ml-1">{sub}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
