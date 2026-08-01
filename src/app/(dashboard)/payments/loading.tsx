import { Skeleton, SkeletonGroup } from "@/components/ui";

export default function PaymentsLoading() {
  return <SkeletonGroup className="space-y-6" label="Loading payments"><div className="space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-56" /><Skeleton className="h-5 max-w-xl" /></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <Skeleton className="h-32" key={index} />)}</div><div className="grid gap-5 xl:grid-cols-2"><Skeleton className="h-96" /><Skeleton className="h-96" /></div></SkeletonGroup>;
}
