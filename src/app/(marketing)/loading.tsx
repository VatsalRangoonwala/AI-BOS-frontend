import { Skeleton, SkeletonGroup } from "@/components/ui";

export default function MarketingLoading() {
  return <SkeletonGroup className="mx-auto max-w-7xl space-y-8 px-4 py-20 sm:px-6 lg:px-8" label="Loading page"><Skeleton className="mx-auto h-5 w-32" /><Skeleton className="mx-auto h-14 w-[min(42rem,90%)]" /><Skeleton className="mx-auto h-5 w-[min(36rem,80%)]" /><div className="flex justify-center gap-3"><Skeleton className="h-12 w-36" /><Skeleton className="h-12 w-36" /></div><Skeleton className="h-[26rem] rounded-xl" /></SkeletonGroup>;
}
