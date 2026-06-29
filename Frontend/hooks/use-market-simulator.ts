"use client"

import { useEffect } from "react"
import { useTickMarket } from "@/store/useTradeStore"

/**
 * useMarketSimulator
 *
 * Mounts a 1-second interval that calls `tickMarket()` in the Zustand store.
 * Drop this hook into any root-level component (e.g. the AppShell / layout)
 * so it runs for the lifetime of the app — it is idempotent and only a single
 * instance should ever be mounted.
 */
export function useMarketSimulator() {
  const tickMarket = useTickMarket()

  useEffect(() => {
    const id = setInterval(tickMarket, 1000)
    return () => clearInterval(id)
  }, [tickMarket])
}
