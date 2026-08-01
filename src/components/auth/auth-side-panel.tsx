import {
  ArrowUpRight,
  CheckCircle2,
  IndianRupee,
  PackageCheck,
  Sparkles,
  Users,
} from "lucide-react";

export function AuthSidePanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-foreground px-10 py-8 text-background lg:flex lg:flex-col xl:px-14" aria-label="AI-BOS product overview">
      <div aria-hidden="true" className="absolute -left-24 -top-24 size-80 rounded-full bg-primary/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-28 -right-24 size-80 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mt-auto mb-auto max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/10 px-3 py-1.5 text-xs font-semibold text-background/80">
          <Sparkles className="size-3.5" aria-hidden="true" />
          One calm business workspace
        </span>
        <h2 className="mt-6 text-balance text-4xl font-bold tracking-[-0.045em] xl:text-5xl">
          Know what happened today. Know what needs you next.
        </h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-background/65">
          Keep sales, stock, customers, invoices and payments connected—then ask AI-BOS for the short version.
        </p>

        <div className="mt-9 rounded-3xl border border-background/15 bg-background/[0.07] p-4 shadow-2xl backdrop-blur-sm xl:p-5">
          <div className="flex items-center justify-between border-b border-background/10 pb-4">
            <div>
              <p className="text-xs text-background/55">Sharma Mobile & Electronics</p>
              <p className="mt-1 text-sm font-semibold">Today’s business pulse</p>
            </div>
            <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-[10px] font-semibold text-secondary">Live demo</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <PreviewMetric icon={IndianRupee} label="Sales" value="₹2,495" />
            <PreviewMetric icon={Users} label="Customers" value="6" />
            <PreviewMetric icon={PackageCheck} label="Stock alerts" value="3" />
          </div>
          <div className="mt-3 rounded-2xl bg-background/10 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold">AI business insight</p>
                <p className="mt-1 text-xs leading-5 text-background/60">
                  boAt earphone stock may run out within five days. Consider ordering 24 units.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  Review inventory
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {["Set up in minutes", "Works on any device", "Confirm important actions"].map((item) => (
            <div className="flex items-center gap-2 text-xs text-background/65" key={item}>
              <CheckCircle2 className="size-4 shrink-0 text-secondary" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <p className="relative mt-8 text-xs text-background/45">
        Built for growing Indian businesses.
      </p>
    </aside>
  );
}

function PreviewMetric({
  icon: MetricIcon,
  label,
  value,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-background/10 p-3">
      <MetricIcon className="size-4 text-secondary" aria-hidden="true" />
      <p className="mt-3 text-[10px] text-background/50">{label}</p>
      <p className="mt-1 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

