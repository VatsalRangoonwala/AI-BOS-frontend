import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Check,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Send,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

const previewNavigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Customers", icon: Users },
  { label: "Inventory", icon: Boxes },
  { label: "Invoices", icon: FileText },
  { label: "Analytics", icon: BarChart3 },
] as const;

const revenuePoints = "0,78 48,64 96,70 144,42 192,49 240,24 288,34 336,8";

export function ProductPreview() {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-border-strong bg-card shadow-[0_24px_70px_-36px_rgba(15,23,42,0.35)] lg:grid-cols-[1.45fr_0.75fr]">
      <div className="min-w-0 border-b border-border lg:border-b-0 lg:border-r">
        <div className="flex h-11 items-center gap-2 border-b border-border bg-muted/60 px-4">
          <span className="size-2.5 rounded-full bg-danger/60" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-warning/60" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-success/60" aria-hidden="true" />
          <span className="ml-3 rounded-md bg-card px-3 py-1 text-[10px] font-medium text-muted-foreground">
            app.ai-bos.in/dashboard
          </span>
        </div>

        <div className="grid min-h-[31rem] sm:grid-cols-[9rem_1fr]">
          <aside className="hidden border-r border-border bg-muted/35 p-3 sm:block" aria-label="Product preview navigation">
            <div className="mb-5 flex items-center gap-2 px-2 pt-1">
              <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                A
              </span>
              <span className="text-xs font-bold">AI-BOS</span>
            </div>
            <div className="space-y-1">
              {previewNavigation.map((item) => {
                const PreviewIcon = item.icon;

                return (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium ${
                      "active" in item && item.active
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground"
                    }`}
                    key={item.label}
                  >
                    <PreviewIcon className="size-3.5" aria-hidden="true" />
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="mt-24 rounded-xl border border-primary/15 bg-primary-soft p-2.5">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              <p className="mt-2 text-[10px] font-semibold leading-4 text-foreground">
                Ask AI about today&apos;s business
              </p>
            </div>
          </aside>

          <div className="min-w-0 bg-background p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Saturday, 1 August</p>
                <p className="text-sm font-bold tracking-tight">Good morning, Vikram</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground">
                  <Bell className="size-3.5" aria-hidden="true" />
                </span>
                <span className="hidden rounded-lg bg-primary px-3 py-2 text-[10px] font-semibold text-primary-foreground sm:inline-flex">
                  + Create invoice
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-3">
              <PreviewStat label="Today’s sales" value="₹2,495" change="+8.2%" icon={WalletCards} />
              <PreviewStat label="Outstanding" value="₹8,390" change="3 customers" icon={Users} />
              <PreviewStat label="Low stock" value="3 items" change="Needs action" icon={Package} />
            </div>

            <div className="mt-2 grid gap-2 xl:grid-cols-[1.35fr_0.9fr]">
              <div className="rounded-xl border border-border bg-card p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold">Revenue overview</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">Last 7 days</p>
                  </div>
                  <span className="text-[10px] font-semibold text-success">+12.4%</span>
                </div>
                <svg
                  className="mt-4 h-24 w-full overflow-visible"
                  viewBox="0 0 336 86"
                  role="img"
                  aria-label="Revenue has increased over the last seven days"
                  preserveAspectRatio="none"
                >
                  <path d="M0 82H336" stroke="currentColor" className="text-border" />
                  <path d="M0 54H336" stroke="currentColor" className="text-border" strokeDasharray="3 5" />
                  <polyline
                    points={revenuePoints}
                    fill="none"
                    stroke="currentColor"
                    className="text-primary"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="336" cy="8" r="4" fill="currentColor" className="text-primary" />
                </svg>
              </div>

              <div className="rounded-xl border border-border bg-card p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold">Payment health</p>
                  <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-4 grid place-items-center">
                  <div className="relative grid size-20 place-items-center rounded-full bg-[conic-gradient(var(--success)_0_50%,var(--surface-muted)_50%_100%)]">
                    <div className="grid size-14 place-items-center rounded-full bg-card text-center">
                      <span className="text-sm font-bold">50%</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground">Collected this period</p>
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between px-3.5 py-3">
                <p className="text-xs font-semibold">Recent orders</p>
                <span className="text-[10px] font-medium text-primary">View all</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-border px-3.5 py-2.5 text-[10px]">
                <span className="font-medium">Rahul Sharma · ORD-2042</span>
                <span className="tabular-nums">₹4,297</span>
                <span className="rounded-full bg-success-soft px-2 py-1 font-semibold text-success">Completed</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-border px-3.5 py-2.5 text-[10px]">
                <span className="font-medium">Priya Nair · ORD-2043</span>
                <span className="tabular-nums">₹2,495</span>
                <span className="rounded-full bg-info-soft px-2 py-1 font-semibold text-info">Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[31rem] flex-col bg-card">
        <div className="flex h-11 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold">AI Business Assistant</p>
              <p className="text-[9px] text-success">Ready · Business data connected</p>
            </div>
          </div>
          <MessageSquareText className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="flex flex-1 flex-col gap-3 bg-muted/25 p-4">
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-xs leading-5 text-primary-foreground">
            Who has not paid me yet?
          </div>

          <div className="max-w-[94%] rounded-2xl rounded-bl-md border border-border bg-card p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              3 customers have open balances
            </div>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
              ₹8,390 is outstanding. Amit Patel&apos;s invoice is overdue and needs attention first.
            </p>
            <div className="mt-3 space-y-2">
              <AIResultRow name="Amit Patel" value="₹3,598" badge="Overdue" urgent />
              <AIResultRow name="Priya Nair" value="₹2,495" badge="Due 7 Aug" />
              <AIResultRow name="Rahul Sharma" value="₹2,297" badge="Due 4 Aug" />
            </div>
            <button
              type="button"
              className="mt-3 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary-soft px-3 text-[10px] font-semibold text-primary"
            >
              Send reminder to Amit
              <Send className="size-3" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-auto rounded-xl border border-primary/15 bg-primary-soft p-3">
            <div className="flex items-start gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-3.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-semibold text-foreground">Proactive insight</p>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Earphone stock could run out in five days. Consider ordering 24 units.
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 text-[10px] text-muted-foreground shadow-sm">
            Ask about sales, stock or payments…
            <span className="ml-auto grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Send className="size-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStat({
  label,
  value,
  change,
  icon: StatIcon,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof Package;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="grid size-6 place-items-center rounded-md bg-primary-soft text-primary">
          <StatIcon className="size-3" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-base font-bold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-[9px] font-medium text-success">{change}</p>
    </div>
  );
}

function AIResultRow({
  name,
  value,
  badge,
  urgent = false,
}: {
  name: string;
  value: string;
  badge: string;
  urgent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/70 px-2.5 py-2 text-[10px]">
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-full ${
          urgent ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
        }`}
      >
        <Check className="size-3" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">{name}</span>
      <span className="font-semibold tabular-nums">{value}</span>
      <span className={urgent ? "text-danger" : "text-muted-foreground"}>{badge}</span>
    </div>
  );
}
