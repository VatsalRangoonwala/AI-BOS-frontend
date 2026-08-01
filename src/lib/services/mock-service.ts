import type {
  AIConversation,
  AnalyticsSummary,
  Customer,
  Invoice,
  Notification,
  Order,
  Payment,
  Product,
} from "@/types";

import {
  aiConversations,
  analyticsSummary,
  customers,
  dashboardMetrics,
  invoices,
  notifications,
  orders,
  payments,
  products,
} from "@/lib/mock-data";

export type MockScenario = "success" | "empty" | "failure";

export interface MockServiceOptions {
  scenario?: MockScenario;
  delayMs?: number;
  failureMessage?: string;
  signal?: AbortSignal;
}

interface MockRequestOptions<T> extends MockServiceOptions {
  emptyData?: T | null;
}

export interface MockServiceError {
  code: "MOCK_API_FAILURE";
  message: string;
  retryable: true;
}

export type MockServiceResult<T> =
  | {
      ok: true;
      state: "success" | "empty";
      data: T | null;
      error: null;
      completedAt: string;
    }
  | {
      ok: false;
      state: "failure";
      data: null;
      error: MockServiceError;
      completedAt: string;
    };

function createAbortError() {
  const error = new Error("The mock request was cancelled.");
  error.name = "AbortError";
  return error;
}

function wait(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, Math.max(0, delayMs));

    function handleAbort() {
      clearTimeout(timeoutId);
      reject(createAbortError());
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

export async function simulateMockRequest<T>(
  successData: T,
  {
    scenario = "success",
    delayMs = 450,
    failureMessage = "Something went wrong while loading mock data.",
    signal,
    emptyData = null,
  }: MockRequestOptions<T> = {},
): Promise<MockServiceResult<T>> {
  await wait(delayMs, signal);

  const completedAt = new Date().toISOString();

  if (scenario === "failure") {
    return {
      ok: false,
      state: "failure",
      data: null,
      error: {
        code: "MOCK_API_FAILURE",
        message: failureMessage,
        retryable: true,
      },
      completedAt,
    };
  }

  if (scenario === "empty") {
    return {
      ok: true,
      state: "empty",
      data: emptyData,
      error: null,
      completedAt,
    };
  }

  return {
    ok: true,
    state: "success",
    data: successData,
    error: null,
    completedAt,
  };
}

export function getCustomers(options: MockServiceOptions = {}) {
  return simulateMockRequest<Customer[]>(customers, {
    ...options,
    emptyData: [],
  });
}

export function getCustomerById(
  customerId: string,
  options: MockServiceOptions = {},
) {
  const customer = customers.find((candidate) => candidate.id === customerId);

  return simulateMockRequest<Customer | null>(customer ?? null, {
    ...options,
    scenario: customer ? options.scenario : (options.scenario ?? "empty"),
    emptyData: null,
  });
}

export function getProducts(options: MockServiceOptions = {}) {
  return simulateMockRequest<Product[]>(products, {
    ...options,
    emptyData: [],
  });
}

export function getProductById(
  productId: string,
  options: MockServiceOptions = {},
) {
  const product = products.find((candidate) => candidate.id === productId);

  return simulateMockRequest<Product | null>(product ?? null, {
    ...options,
    scenario: product ? options.scenario : (options.scenario ?? "empty"),
    emptyData: null,
  });
}

export function getInvoices(options: MockServiceOptions = {}) {
  return simulateMockRequest<Invoice[]>(invoices, {
    ...options,
    emptyData: [],
  });
}

export function getInvoiceById(
  invoiceId: string,
  options: MockServiceOptions = {},
) {
  const invoice = invoices.find((candidate) => candidate.id === invoiceId);

  return simulateMockRequest<Invoice | null>(invoice ?? null, {
    ...options,
    scenario: invoice ? options.scenario : (options.scenario ?? "empty"),
    emptyData: null,
  });
}

export function getOrders(options: MockServiceOptions = {}) {
  return simulateMockRequest<Order[]>(orders, {
    ...options,
    emptyData: [],
  });
}

export function getPayments(options: MockServiceOptions = {}) {
  return simulateMockRequest<Payment[]>(payments, {
    ...options,
    emptyData: [],
  });
}

export function getNotifications(options: MockServiceOptions = {}) {
  return simulateMockRequest<Notification[]>(notifications, {
    ...options,
    emptyData: [],
  });
}

export function getAnalytics(options: MockServiceOptions = {}) {
  return simulateMockRequest<AnalyticsSummary>(analyticsSummary, {
    ...options,
    emptyData: null,
  });
}

export function getDashboardMetrics(options: MockServiceOptions = {}) {
  return simulateMockRequest<typeof dashboardMetrics>(dashboardMetrics, {
    ...options,
    emptyData: null,
  });
}

export function getAIConversations(options: MockServiceOptions = {}) {
  return simulateMockRequest<AIConversation[]>(aiConversations, {
    ...options,
    emptyData: [],
  });
}

export function saveMockRecord<T>(
  record: T,
  options: MockServiceOptions = {},
) {
  return simulateMockRequest(record, {
    ...options,
    emptyData: null,
  });
}

export const mockService = {
  getCustomers,
  getCustomerById,
  getProducts,
  getProductById,
  getInvoices,
  getInvoiceById,
  getOrders,
  getPayments,
  getNotifications,
  getAnalytics,
  getDashboardMetrics,
  getAIConversations,
  save: saveMockRecord,
};

