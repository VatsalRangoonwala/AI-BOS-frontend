import { Skeleton, SkeletonGroup } from "@/components/ui";

export function RouteLoading({ compact = false }: { compact?: boolean }) {
  return (
    <SkeletonGroup className="space-y-6" label="Loading page content">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-56" /><Skeleton className="h-4 w-80 max-w-[70vw]" /></div>
        <Skeleton className="hidden h-11 w-32 sm:block" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32 rounded-lg" />)}</div>
      {!compact ? <div className="grid gap-5 xl:grid-cols-[1.6fr_0.8fr]"><Skeleton className="h-80 rounded-lg" /><Skeleton className="h-80 rounded-lg" /></div> : null}
      <Skeleton className="h-64 rounded-lg" />
    </SkeletonGroup>
  );
}
