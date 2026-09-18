import { describe, it, expect, beforeEach } from "vitest";
import { useInvoiceDraftStore } from "./invoice-draft-store";

describe("useInvoiceDraftStore", () => {
  beforeEach(() => {
    useInvoiceDraftStore.getState().clearDraft();
  });

  it("adds line items and updates calculations", () => {
    useInvoiceDraftStore.getState().addItem({
      productId: "prod_001",
      name: "boAt Rockerz 255 Pro+",
      sku: "BOAT-ROC-255P",
      hsnCode: "85183000",
      quantity: 2,
      unitPrice: 1299,
      taxRate: 18,
    });

    const store = useInvoiceDraftStore.getState();
    expect(store.items.length).toBe(1);
    expect(store.items[0].quantity).toBe(2);

    // Subtotal = 2 * 1299 = 2598
    expect(store.getSubtotal()).toBe(2598);

    // Tax (18%) = 2598 * 0.18 = 467.64
    expect(store.getTaxTotal()).toBeCloseTo(467.64, 2);

    // Grand total = 2598 + 467.64 = 3065.64
    expect(store.getGrandTotal()).toBeCloseTo(3065.64, 2);
  });

  it("applies discounts accurately", () => {
    useInvoiceDraftStore.getState().addItem({
      productId: "prod_002",
      name: "Samsung 25W Charger",
      sku: "SAM-CHG-25W",
      hsnCode: "85044030",
      quantity: 1,
      unitPrice: 1200,
      taxRate: 18,
    });

    useInvoiceDraftStore.getState().setDiscount(200);

    const store = useInvoiceDraftStore.getState();
    // Subtotal: 1200, Tax: 216, Discount: 200 => Grand Total: 1216
    expect(store.getGrandTotal()).toBeCloseTo(1216, 2);
  });

  it("stacks quantities when adding the same product multiple times", () => {
    useInvoiceDraftStore.getState().addItem({
      productId: "prod_003",
      name: "Tempered Glass Protector",
      sku: "ACC-TG-UNIV",
      hsnCode: "70071900",
      quantity: 1,
      unitPrice: 150,
      taxRate: 18,
    });

    useInvoiceDraftStore.getState().addItem({
      productId: "prod_003",
      name: "Tempered Glass Protector",
      sku: "ACC-TG-UNIV",
      hsnCode: "70071900",
      quantity: 3,
      unitPrice: 150,
      taxRate: 18,
    });

    const store = useInvoiceDraftStore.getState();
    expect(store.items.length).toBe(1);
    expect(store.items[0].quantity).toBe(4);
    expect(store.getSubtotal()).toBe(600);
  });

  it("removes items and updates totals", () => {
    useInvoiceDraftStore.getState().addItem({
      productId: "prod_004",
      name: "Fast USB-C Cable",
      sku: "ACC-CBL-USBC",
      hsnCode: "85444299",
      quantity: 1,
      unitPrice: 250,
      taxRate: 18,
    });

    const item = useInvoiceDraftStore.getState().items[0];
    useInvoiceDraftStore.getState().removeItem(item.id);

    const store = useInvoiceDraftStore.getState();
    expect(store.items.length).toBe(0);
    expect(store.getSubtotal()).toBe(0);
    expect(store.getGrandTotal()).toBe(0);
  });
});
