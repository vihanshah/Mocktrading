import { useEffect } from "react"
import { useTickMarket, useMarketRunning, useSimulationSpeed } from "@/store/useTradeStore"

/**
 * Frontend-only market simulator.
 * Calls `tickMarket()` every second (adjusted by simulation speed) to advance all prices, portfolio values,
 * and leaderboard rankings with realistic micro-movements.
 *
 * Respects market pause/resume and simulation speed (1x, 2x, 5x).
 */
export function useMarketSimulator() {
  const tickMarket = useTickMarket()
  const marketRunning = useMarketRunning()
  const simulationSpeed = useSimulationSpeed()

  useEffect(() => {
    if (!marketRunning) return

    // Calculate interval based on speed: 1x = 1000ms, 2x = 500ms, 5x = 200ms
    const interval = 1000 / simulationSpeed

    const timer = setInterval(() => {
      tickMarket()
    }, interval)

    return () => clearInterval(timer)
  }, [marketRunning, simulationSpeed, tickMarket])
}
