"use client";

import { useEffect, useRef } from "react";

export function usePolling(callback: () => Promise<void> | void, intervalMs: number, enabled = true) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      if (cancelled) {
        return;
      }

      await callbackRef.current();
    };

    const id = window.setInterval(run, intervalMs);
    void run();

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [enabled, intervalMs]);
}
