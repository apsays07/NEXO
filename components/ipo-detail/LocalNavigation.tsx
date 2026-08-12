"use client";

import React, { useState, useEffect } from "react";

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "decision", label: "Our Decision" },
  { id: "snapshot", label: "IPO Snapshot" },
  { id: "evaluation", label: "Evaluation" },
  { id: "participation", label: "Participation" },
  { id: "application", label: "Application Proof" },
  { id: "allotment", label: "Allotment" },
  { id: "performance", label: "Performance" },
];

export function LocalNavigation() {
  const [activeId, setActiveId] = useState("overview");

  const scrollToSection = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] py-2 px-1 flex items-center gap-1 overflow-x-auto">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeId === item.id
              ? "bg-[#EFF6FF] text-[#2563EB]"
              : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
