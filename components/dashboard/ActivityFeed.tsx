"use client";

import React from "react";
import { Card } from "../ui/Card";
import { ActivityItem } from "@/types/nexo";
import { Clock } from "@phosphor-icons/react";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-2xs flex flex-col justify-between h-full font-sans">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#2563EB]" />
            <h3 className="nexo-h4 text-[#111318]">
              RECENT ACTIVITY
            </h3>
          </div>
          <span className="text-xs text-[#5F6673] font-medium">Activity Log</span>
        </div>

        <div className="space-y-3.5">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-[#F8FAFC] transition-colors"
            >
              <img
                src={act.memberAvatar}
                alt={act.memberName}
                className="w-7 h-7 rounded-full object-cover mt-0.5 ring-1 ring-[#E2E8F0] shrink-0"
              />
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-semibold text-[#111318] leading-tight">
                  {act.title}
                </div>
                <div className="text-[11px] text-[#5F6673] line-clamp-1 mt-0.5 font-normal">
                  {act.subtitle}
                </div>
                <div className="text-[10px] text-[#7B8491] font-mono mt-1">
                  {act.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-center">
        <span className="text-[11px] text-[#5F6673] font-normal">
          Encrypted group activity stream
        </span>
      </div>
    </Card>
  );
}
