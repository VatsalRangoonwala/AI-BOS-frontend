import { ChevronDown, Clock3, MessageSquareText } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

const tickets = [
  {
    id: "SUP-482193",
    subject: "Invoice PDF logo appears blurred",
    category: "Invoices",
    status: "Resolved",
    tone: "success" as const,
    updatedAt: "2026-07-29T09:40:00.000Z",
    response: "Updated export settings shared",
  },
  {
    id: "SUP-475821",
    subject: "Need help reconciling opening stock",
    category: "Inventory",
    status: "In progress",
    tone: "info" as const,
    updatedAt: "2026-07-31T06:15:00.000Z",
    response: "Assigned to inventory support",
  },
  {
    id: "SUP-468304",
    subject: "Team invitation email not received",
    category: "Account",
    status: "Waiting on you",
    tone: "warning" as const,
    updatedAt: "2026-07-24T11:25:00.000Z",
    response: "Please confirm the recipient email",
  },
];

export function SupportTickets() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-info-soft text-info"><MessageSquareText className="size-5" /></span>
          <div><CardTitle>Previous requests</CardTitle><p className="mt-1 text-sm leading-6 text-muted-foreground">Recent conversations for this business workspace.</p></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="text-xs font-semibold text-primary">{ticket.id}</p><h3 className="mt-1 font-semibold leading-5">{ticket.subject}</h3></div>
              <Badge variant={ticket.tone} dot>{ticket.status}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>{ticket.category}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{formatDateTime(ticket.updatedAt)}</span></div>
            <details className="group mt-3 border-t border-border pt-3">
              <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold text-primary">
                View ticket details
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="mt-2 rounded-lg bg-muted/55 p-3 text-xs leading-5 text-muted-foreground">
                <p><strong className="text-foreground">Latest update:</strong> {ticket.response}</p>
                <p className="mt-1">Replies and attachments would appear here when connected to the support service.</p>
              </div>
            </details>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
