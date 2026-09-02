import { describe, it, expect, vi, beforeEach } from "vitest";
import { isOpenNow } from "./utils";

const HOURS = [
  { day: "Monday", open: "06:00", close: "22:00", closed: false },
  { day: "Sunday", open: "00:00", close: "00:00", closed: true },
];

function mockDate(dayIndex: number, hour: number, minute: number) {
  // 2024-01-01 is a Monday (dayIndex 0 = Monday offset from that date)
  const d = new Date(2024, 0, 1 + dayIndex);
  d.setHours(hour, minute, 0, 0);
  vi.setSystemTime(d);
}

beforeEach(() => vi.useFakeTimers());

describe("isOpenNow", () => {
  it("returns open during business hours", () => {
    mockDate(0, 10, 0);
    expect(isOpenNow(HOURS)).toBe("open");
  });

  it("returns closing-soon within 60 minutes of close", () => {
    mockDate(0, 21, 30);
    expect(isOpenNow(HOURS)).toBe("closing-soon");
  });

  it("returns closed before opening", () => {
    mockDate(0, 5, 0);
    expect(isOpenNow(HOURS)).toBe("closed");
  });

  it("returns closed after closing", () => {
    mockDate(0, 23, 0);
    expect(isOpenNow(HOURS)).toBe("closed");
  });

  it("returns closed on a closed day", () => {
    mockDate(6, 12, 0); // Sunday
    expect(isOpenNow(HOURS)).toBe("closed");
  });
});
