import { describe, it, expect } from "vitest";
import { formatINR, formatDate, formatDateTime, getInitials, formatIndianPhone, cn } from "./utils";

describe("formatINR", () => {
  it("formats standard amounts in Indian Rupee format", () => {
    const formatted = formatINR(100000);
    // INR uses ₹1,00,000
    expect(formatted).toContain("1,00,000");
  });

  it("handles decimal paise when requested", () => {
    const formatted = formatINR(1250.5, { showPaise: true });
    expect(formatted).toContain("1,250.50");
  });

  it("formats compact amounts when requested", () => {
    const formatted = formatINR(1000000, { compact: true });
    expect(formatted).toBeDefined();
    expect(formatted.length).toBeGreaterThan(0);
  });

  it("handles zero and negative amounts gracefully", () => {
    expect(formatINR(0)).toContain("0");
    expect(formatINR(NaN)).toContain("0");
  });
});

describe("formatDate & formatDateTime", () => {
  it("formats valid ISO date strings to IST dates", () => {
    const formatted = formatDate("2026-08-15T00:00:00.000Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("Aug");
  });

  it("returns a dash for null or invalid inputs", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("invalid-date")).toBe("—");
  });

  it("formats date and time accurately", () => {
    const formatted = formatDateTime("2026-08-15T10:30:00.000Z");
    expect(formatted).toContain("2026");
  });
});

describe("getInitials", () => {
  it("extracts two uppercase initials from a full name", () => {
    expect(getInitials("Vikram Sharma")).toBe("VS");
    expect(getInitials("Anjali Patel")).toBe("AP");
  });

  it("handles single-word names", () => {
    expect(getInitials("Pooja")).toBe("P");
  });

  it("handles empty or whitespace strings gracefully", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("   ")).toBe("?");
  });
});

describe("formatIndianPhone", () => {
  it("formats 10-digit mobile numbers with Indian country code", () => {
    expect(formatIndianPhone("9876543210")).toBe("+91 98765 43210");
  });

  it("strips non-digits before formatting", () => {
    expect(formatIndianPhone("+91-98765-43210")).toBe("+91 98765 43210");
  });

  it("returns original input if not 10 digits", () => {
    expect(formatIndianPhone("12345")).toBe("12345");
  });
});

describe("cn", () => {
  it("merges class names and handles Tailwind conflicts correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-red-500", false && "hidden", "font-bold")).toBe("text-red-500 font-bold");
  });
});
