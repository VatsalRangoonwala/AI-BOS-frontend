"use client";

import { Eye, Search, ShieldBan, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  NativeSelect,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export type ManagementRow = {
  id: string;
  name: string;
  detail: string;
  role: string;
  plan: string;
  status: string;
  date: string;
  meta?: string;
};

function planTone(plan: string) {
  return plan === "Premium" ? "primary" : plan === "Pro" ? "info" : "neutral";
}

function statusTone(status: string) {
  return status === "Active" ? "success" : status === "Pending" ? "warning" : "danger";
}

export function ManagementTable({
  rows: initialRows,
  entityLabel = "user",
}: {
  rows: ManagementRow[];
  entityLabel?: "user" | "business";
}) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [viewingId, setViewingId] = useState<string | null>(null);
  const { toast } = useToast();

  const visible = useMemo(
    () => rows.filter((row) =>
      (status === "all" || row.status.toLowerCase() === status)
      && `${row.name} ${row.detail} ${row.plan}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [query, rows, status],
  );
  const viewingRow = viewingId ? rows.find((row) => row.id === viewingId) ?? null : null;

  const toggle = (id: string) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    const next = row.status === "Suspended" ? "Active" : "Suspended";
    setRows((current) => current.map((item) => item.id === id ? { ...item, status: next } : item));
    toast({
      title: `${row.name} ${next.toLowerCase()}`,
      description: `This is a mock ${entityLabel} status change.`,
      variant: next === "Active" ? "success" : "warning",
    });
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search {entityLabel}s</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${entityLabel}s…`}
              className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-3 text-sm"
            />
          </label>
          <NativeSelect value={status} onChange={(event) => setStatus(event.target.value)} wrapperClassName="sm:w-44" aria-label={`Filter ${entityLabel}s by status`}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </NativeSelect>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{entityLabel === "user" ? "User" : "Business"}</th>
                <th className="px-4 py-3">{entityLabel === "user" ? "Role" : "Type / owner"}</th>
                <th className="px-4 py-3">Subscription</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((row) => (
                <tr key={row.id} className="hover:bg-muted/35">
                  <td className="px-4 py-4"><p className="font-semibold">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{row.detail}</p></td>
                  <td className="px-4 py-4 text-muted-foreground"><p>{row.role}</p>{row.meta ? <p className="mt-1 text-xs">{row.meta}</p> : null}</td>
                  <td className="px-4 py-4"><Badge variant={planTone(row.plan)}>{row.plan}</Badge></td>
                  <td className="px-4 py-4"><Badge variant={statusTone(row.status)}>{row.status}</Badge></td>
                  <td className="px-4 py-4 text-muted-foreground">{row.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Button size="icon-sm" variant="ghost" onClick={() => setViewingId(row.id)} aria-label={`View ${row.name}`}><Eye className="size-4" /></Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => toggle(row.id)} aria-label={`${row.status === "Suspended" ? "Reactivate" : "Suspend"} ${row.name}`} className={cn(row.status === "Suspended" ? "text-success" : "text-danger")}>
                        {row.status === "Suspended" ? <ShieldCheck className="size-4" /> : <ShieldBan className="size-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {visible.map((row) => (
            <article key={row.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-semibold">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{row.detail}</p></div>
                <Badge variant={statusTone(row.status)}>{row.status}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
                <div><dt className="text-muted-foreground">Role / type</dt><dd className="mt-1 font-semibold">{row.role}</dd></div>
                <div><dt className="text-muted-foreground">Plan</dt><dd className="mt-1 font-semibold">{row.plan}</dd></div>
                <div><dt className="text-muted-foreground">Registered</dt><dd className="mt-1 font-semibold">{row.date}</dd></div>
              </dl>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewingId(row.id)}><Eye className="size-4" />View</Button>
                <Button variant="ghost" size="sm" onClick={() => toggle(row.id)} className={row.status === "Suspended" ? "text-success" : "text-danger"}>{row.status === "Suspended" ? "Reactivate" : "Suspend"}</Button>
              </div>
            </article>
          ))}
        </div>

        {!visible.length ? <div className="py-16 text-center"><p className="font-semibold">No matching {entityLabel}s</p><p className="mt-1 text-sm text-muted-foreground">Try a broader search or another status.</p></div> : null}
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Showing {visible.length} of {rows.length} {entityLabel}s</div>
      </Card>

      <Dialog open={Boolean(viewingRow)} onOpenChange={(open) => !open && setViewingId(null)}>
        <DialogContent>
          {viewingRow ? (
            <>
              <DialogHeader>
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><Eye className="size-5" /></span>
                <DialogTitle>{viewingRow.name}</DialogTitle>
                <DialogDescription>Review this mock platform {entityLabel} record before changing its account status.</DialogDescription>
              </DialogHeader>
              <dl className="grid gap-3 rounded-xl border border-border bg-muted/35 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Contact / owner</dt><dd className="mt-1 text-sm font-semibold">{viewingRow.detail}</dd></div>
                <div><dt className="text-xs text-muted-foreground">{entityLabel === "user" ? "Role" : "Business type"}</dt><dd className="mt-1 text-sm font-semibold">{viewingRow.role}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Subscription</dt><dd className="mt-1"><Badge variant={planTone(viewingRow.plan)}>{viewingRow.plan}</Badge></dd></div>
                <div><dt className="text-xs text-muted-foreground">Status</dt><dd className="mt-1"><Badge variant={statusTone(viewingRow.status)}>{viewingRow.status}</Badge></dd></div>
                <div><dt className="text-xs text-muted-foreground">Registered</dt><dd className="mt-1 text-sm font-semibold">{viewingRow.date}</dd></div>
                {viewingRow.meta ? <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Additional details</dt><dd className="mt-1 text-sm font-semibold">{viewingRow.meta}</dd></div> : null}
              </dl>
              <DialogFooter><DialogClose asChild><Button variant="outline">Close record</Button></DialogClose></DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
