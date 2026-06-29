"use client"

import { TrendingUp, TrendingDown, Wallet, DollarSign, BarChart2, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/mock-data"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface PortfolioCardProps {
  title: string
  value: number
  change?: number
  changePct?: number
  isPositive?: boolean
  icon: "portfolio" | "cash" | "pnl" | "holdings"
  subtitle?: string
  sparkData?: { v: number }[]
  isCurrency?: boolean
}

const iconMap = {
  portfolio: Briefcase,
  cash: Wallet,
  pnl: TrendingUp,
  holdings: BarChart2,
}

const colorMap = {
  portfolio: "text-primary bg-primary/10",
  cash: "text-chart-2 bg-chart-2/10",
  pnl: "",
  holdings: "text-chart-3 bg-chart-3/10",
}

export function PortfolioCard({
  title,
  value,
  change,
  changePct,
  isPositive = true,
  icon,
  subtitle,
  sparkData,
  isCurrency = true,
}: PortfolioCardProps) {
  const Icon = iconMap[icon]
  const pnlColorClass =
    icon === "pnl"
      ? isPositive
        ? "text-fin-gain bg-fin-gain/10"
        : "text-fin-loss bg-fin-loss/10"
      : colorMap[icon]

  return (
    <div className="surface-card rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-border/80 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className={cn("font-display text-2xl font-bold mt-1 tracking-tight", isCurrency ? "font-mono" : "")}>
            {isCurrency
              ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : value.toString()}
          </p>
        </div>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", pnlColorClass)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Change indicator */}
      {changePct !== undefined && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-mono",
              isPositive
                ? "bg-fin-gain/15 text-fin-gain"
                : "bg-fin-loss/15 text-fin-loss"
            )}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? "+" : ""}{changePct.toFixed(2)}%
          </div>
          {change !== undefined && (
            <span className={cn("text-xs font-mono", isPositive ? "text-fin-gain" : "text-fin-loss")}>
              {isPositive ? "+" : ""}₹{Math.abs(change).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      )}

      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}

      {/* Spark chart */}
      {sparkData && sparkData.length > 0 && (
        <div className="h-10 -mx-1 -mb-1 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sparkGrad-${icon}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "oklch(0.76 0.16 162)" : "oklch(0.62 0.22 18)"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "oklch(0.76 0.16 162)" : "oklch(0.62 0.22 18)"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={isPositive ? "oklch(0.76 0.16 162)" : "oklch(0.62 0.22 18)"}
                strokeWidth={1.5}
                fill={`url(#sparkGrad-${icon})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
