import { Skeleton, SkeletonGroup } from "@/components/ui";

export default function PaymentRemindersLoading() {
  return <SkeletonGroup className="space-y-6" label="Loading payment reminders"><div className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-72" /><Skeleton className="h-5 max-w-xl" /></div><div className="grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton className="h-32" key={index} />)}</div><Skeleton className="h-[28rem]" /></SkeletonGroup>;
}
