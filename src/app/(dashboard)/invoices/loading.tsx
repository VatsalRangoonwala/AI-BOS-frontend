import { Skeleton, SkeletonGroup } from "@/components/ui";

export default function InvoicesLoading() {
  return (
    <SkeletonGroup className="space-y-6" label="Loading invoices">
      <div className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-64" /><Skeleton className="h-5 max-w-xl" /></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <Skeleton className="h-32" key={index} />)}</div>
      <Skeleton className="h-[28rem]" />
    </SkeletonGroup>
  );
}
