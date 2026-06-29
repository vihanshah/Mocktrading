"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketIndex } from "@/lib/mock-data"
import { Line, LineChart, ResponsiveContainer } from "recharts"

interface MarketIndexCardProps {
  index: MarketIndex
}

export function MarketIndexCard({ index }: MarketIndexCardProps) {
  const sparkData = index.sparkline.map((v) => ({ v }))

  return (
    <div className="surface-card rounded-xl p-4 flex flex-col gap-2 hover:border-border/80 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{index.symbol}</p>
          <p className="text-sm font-medium text-foreground/80 mt-0.5">{index.name}</p>
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-semibold font-mono",
            index.isPositive
              ? "bg-fin-gain/15 text-fin-gain"
              : "bg-fin-loss/15 text-fin-loss"
          )}
        >
          {index.isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {Math.abs(index.changePct).toFixed(2)}%
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono font-bold text-xl text-foreground tracking-tight">
            {index.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p
            className={cn(
              "text-xs font-mono mt-0.5",
              index.isPositive ? "text-fin-gain" : "text-fin-loss"
            )}
          >
            {index.isPositive ? "+" : ""}
            {index.change.toFixed(2)}
          </p>
        </div>

        {/* Sparkline */}
        <div className="h-12 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={index.isPositive ? "oklch(0.76 0.16 162)" : "oklch(0.62 0.22 18)"}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
