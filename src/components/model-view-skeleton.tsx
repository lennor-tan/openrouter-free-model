import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for a single model card
const ModelCardSkeleton = () => (
  <div className="border rounded-lg shadow-sm bg-card p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded-sm" />
        <div className="space-y-1">
          <div className="flex items-center">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-5 w-24 ml-2 rounded" />
          </div>
          <Skeleton className="h-4 w-40 rounded" />
        </div>
      </div>
      <Skeleton className="h-4 w-16 rounded" />
    </div>
    <div className="flex flex-wrap gap-2 mt-3">
      <Skeleton className="h-7 w-28 rounded-md" />
      <Skeleton className="h-7 w-16 rounded-md" />
      <Skeleton className="h-7 w-20 rounded-md" />
      <Skeleton className="h-7 w-48 rounded-md" />
    </div>
  </div>
);

// Skeleton for the model list
export function ModelListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <ModelCardSkeleton key={index} />
      ))}
    </div>
  );
}