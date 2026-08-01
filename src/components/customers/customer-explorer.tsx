"use client";

import { ArrowDownAZ } from "lucide-react";
import { useMemo, useState } from "react";

import { DataExplorer, type DataColumn, type DataRow } from "@/components/shared";
import { NativeSelect } from "@/components/ui";
import { customers } from "@/lib/mock-data";

const columns: DataColumn[] = [
  { key: "customer", label: "Customer", priority: "primary" },
  { key: "mobile", label: "Mobile number", priority: "secondary" },
  { key: "totalPurchases", label: "Total purchases", format: "currency", align: "right" },
  { key: "totalPaid", label: "Paid amount", format: "currency", align: "right" },
  { key: "outstanding", label: "Outstanding", format: "currency", align: "right" },
  { key: "lastTransaction", label: "Last transaction", format: "date" },
  { key: "status", label: "Status", format: "status" },
];

const filters = [
  { label: "All customers", value: "all", key: "segment" },
  { label: "Outstanding balance", value: "outstanding", key: "segment" },
  { label: "Fully paid", value: "fully_paid", key: "segment" },
  { label: "Recently active", value: "recently_active", key: "segment" },
  { label: "Inactive", value: "inactive", key: "segment" },
];

function customerSegment(customer: (typeof customers)[number]) {
  if (customer.status === "inactive") return "inactive";
  if (customer.outstandingBalance > 0) return "outstanding";
  if (customer.lastTransactionAt && customer.lastTransactionAt >= "2026-07-24") return "recently_active";
  return "fully_paid";
}

export function CustomerExplorer() {
  const [sort, setSort] = useState("recent");

  const rows = useMemo<DataRow[]>(() => {
    const sorted = [...customers].sort((left, right) => {
      if (sort === "name") return left.fullName.localeCompare(right.fullName);
      if (sort === "outstanding") return right.outstandingBalance - left.outstandingBalance;
      if (sort === "purchases") return right.totalPurchases - left.totalPurchases;
      return (right.lastTransactionAt ?? "").localeCompare(left.lastTransactionAt ?? "");
    });

    return sorted.map((customer) => ({
      id: customer.id,
      customer: customer.fullName,
      mobile: customer.mobile,
      totalPurchases: customer.totalPurchases,
      totalPaid: customer.totalPaid,
      outstanding: customer.outstandingBalance,
      lastTransaction: customer.lastTransactionAt ?? "—",
      status: customer.status === "active" ? "Active" : "Inactive",
      segment: customerSegment(customer),
    }));
  }, [sort]);

  return (
    <section aria-labelledby="customer-directory-title" className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="customer-directory-title" className="text-lg font-semibold tracking-tight">Customer directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">Search balances and open a complete customer record.</p>
        </div>
        <label className="relative min-w-52">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Sort customers</span>
          <ArrowDownAZ className="pointer-events-none absolute bottom-3.5 left-3 z-10 size-4 text-muted-foreground" aria-hidden="true" />
          <NativeSelect value={sort} onChange={(event) => setSort(event.target.value)} className="pl-9">
            <option value="recent">Most recent</option>
            <option value="name">Name A–Z</option>
            <option value="outstanding">Highest outstanding</option>
            <option value="purchases">Highest purchases</option>
          </NativeSelect>
        </label>
      </div>
      <DataExplorer
        rows={rows}
        columns={columns}
        searchKeys={["customer", "mobile"]}
        searchPlaceholder="Search by name or mobile number…"
        filters={filters}
        viewBasePath="/customers"
        emptyTitle="Add your first customer"
        emptyDescription="Customer profiles keep invoices, payments and follow-ups connected."
        emptyAction={{ label: "Add first customer", href: "/customers/new" }}
      />
    </section>
  );
}
