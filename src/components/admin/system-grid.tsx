"use client";

import { CheckCircle2, Clock3, Database, HardDrive, RefreshCw, Server, Sparkles, Wifi } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Badge, Button, Card } from "@/components/ui";

const services = [
  { name: "API gateway", description: "Mock requests and routing", icon: Server, latency: "84 ms", uptime: "99.99%" },
  { name: "Primary database", description: "Business data storage", icon: Database, latency: "21 ms", uptime: "99.98%" },
  { name: "Redis cache", description: "Sessions and task queues", icon: HardDrive, latency: "5 ms", uptime: "100%" },
  { name: "AI service", description: "Assistant and insights", icon: Sparkles, latency: "1.2 s", uptime: "99.95%" },
  { name: "File storage", description: "Invoices and product media", icon: HardDrive, latency: "46 ms", uptime: "100%" },
  { name: "Notification service", description: "Email, SMS and WhatsApp", icon: Wifi, latency: "132 ms", uptime: "99.97%" },
];

export function SystemGrid() {
  const [refreshing, setRefreshing] = useState(false); const { toast } = useToast();
  const refresh = () => { setRefreshing(true); window.setTimeout(() => { setRefreshing(false); toast({ title: "System status refreshed", description: "All mock services are operational.", variant: "success" }); }, 700); };
  return <div><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Service status</h2><p className="mt-1 text-sm text-muted-foreground">Frontend-only operational health data.</p></div><Button variant="outline" onClick={refresh} disabled={refreshing}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />Refresh</Button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map((service) => <Card key={service.name} className="p-5"><div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success"><service.icon className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{service.name}</h3><Badge variant="success"><CheckCircle2 className="size-3" />Operational</Badge></div><p className="mt-1 text-xs text-muted-foreground">{service.description}</p></div></div><dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs"><div><dt className="text-muted-foreground">Latency</dt><dd className="mt-1 font-semibold">{service.latency}</dd></div><div><dt className="text-muted-foreground">30-day uptime</dt><dd className="mt-1 font-semibold">{service.uptime}</dd></div></dl></Card>)}</div><div className="mt-5 flex items-start gap-3 rounded-xl border border-info/25 bg-info-soft p-4 text-sm text-info"><Clock3 className="mt-0.5 size-4 shrink-0" /><p><strong>Planned maintenance:</strong> No maintenance is currently scheduled. This page uses mock status data only.</p></div></div>;
}
