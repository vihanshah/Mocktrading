"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import {
  useMarketRunning,
  useSimulationSpeed,
  useSimulationTick,
  useTotalTrades,
  useStartMarket,
  usePauseMarket,
  useSetSimulationSpeed,
  useResetCompetition,
} from "@/store/useTradeStore"

export function CompetitionControlPanel() {
  const [showResetDialog, setShowResetDialog] = useState(false)
  const marketRunning = useMarketRunning()
  const simulationSpeed = useSimulationSpeed()
  const simulationTick = useSimulationTick()
  const totalTrades = useTotalTrades()
  const startMarket = useStartMarket()
  const pauseMarket = usePauseMarket()
  const setSimulationSpeed = useSetSimulationSpeed()
  const resetCompetition = useResetCompetition()

  const handleSpeedChange = (speed: 1 | 2 | 5) => {
    setSimulationSpeed(speed)
  }

  const handleResetConfirm = () => {
    resetCompetition()
    setShowResetDialog(false)
  }

  return (
    <>
      {/* ── Control Panel Container ── */}
      <div className="flex items-center gap-4 px-5 py-3 border-l border-border/40">
        {/* ── Market Status ── */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Market</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                marketRunning ? "bg-fin-gain animate-pulse-soft" : "bg-fin-loss"
              )}
            />
            <span className="text-xs font-semibold text-foreground">
              {marketRunning ? "Running" : "Paused"}
            </span>
          </div>
        </div>

        {/* ── Speed Control ── */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Speed</span>
          <div className="flex items-center gap-1">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed as 1 | 2 | 5)}
                className={cn(
                  "px-2 py-1 rounded text-xs font-semibold transition-all duration-150",
                  simulationSpeed === speed
                    ? "bg-primary text-primary-foreground"
                    : "bg-fin-surface-hover text-muted-foreground hover:text-foreground"
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* ── Simulator Stats ── */}
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground px-3 py-2 bg-fin-surface-hover rounded-lg">
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Tick</span>
            <span className="text-foreground font-semibold">{simulationTick}</span>
          </div>
          <div className="w-px h-8 bg-border/40" />
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Trades</span>
            <span className="text-foreground font-semibold">{totalTrades}</span>
          </div>
        </div>

        {/* ── Control Buttons ── */}
        <div className="flex items-center gap-2">
          {marketRunning ? (
            <Button
              onClick={pauseMarket}
              size="sm"
              variant="outline"
              className="gap-1.5 h-8"
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={startMarket}
              size="sm"
              className="gap-1.5 h-8 bg-fin-gain hover:bg-fin-gain/90"
            >
              <Play className="w-4 h-4" />
              Start
            </Button>
          )}

          <Button
            onClick={() => setShowResetDialog(true)}
            size="sm"
            variant="outline"
            className="gap-1.5 h-8 text-fin-loss hover:text-fin-loss"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* ── Reset Confirmation Dialog ── */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Competition</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore all portfolios to initial state, clear all transactions, and reset the leaderboard.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              className="bg-fin-loss hover:bg-fin-loss/90"
            >
              Reset Competition
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
