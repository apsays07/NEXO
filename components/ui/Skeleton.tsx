import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-line/60 animate-pulse rounded-xl ${className}`}
    />
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-4 gap-4 pt-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function IPOCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
