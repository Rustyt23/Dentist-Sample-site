"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const minuteNow = () => Math.floor(Date.now() / 60_000);

/**
 * The current time at minute resolution, or null during server render/hydration,
 * so date-dependent UI never mismatches between server and client.
 */
export function useNow() {
  const minute = useSyncExternalStore(noopSubscribe, minuteNow, () => null);
  return minute === null ? null : new Date(minute * 60_000);
}
