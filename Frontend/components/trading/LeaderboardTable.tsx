"use client"

import { Trophy, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeaderboardEntry } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLiveLeaderboard } from "@/store/useTradeStore"

const badgeConfig = {
  gold: { label: "#1", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  silver: { label: "#2", color: "bg-slate-400/20 text-slate-300 border-slate-400/30" },
  bronze: { label: "#3", color: "bg-orange-600/20 text-orange-400 border-orange-600/30" },
}

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-chart-2/20 text-chart-2",
  "bg-chart-3/20 text-chart-3",
  "bg-fin-gain/20 text-fin-gain",
  "bg-fin-loss/20 text-fin-loss",
]

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const badge = entry.badge ? badgeConfig[entry.badge] : null
  // Calculate return percentage: (current portfolio value - initial invested) / initial invested * 100
  const initialInvested = 250000 // Initial portfolio value from mock-data
  const returnPct = entry.portfolioValue > 0 ? ((entry.portfolioValue - initialInvested) / initialInvested) * 100 : 0
  const isPositive = returnPct >= 0
  const avatarColor = avatarColors[index % avatarColors.length]

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150",
        index === 0
          ? "bg-yellow-500/5 border border-yellow-500/20"
          : "hover:bg-fin-surface-hover border border-transparent hover:border-border/40"
      )}
    >
      {/* Rank */}
      <div className="w-6 shrink-0 text-center">
        {badge ? (
          <div
            className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border",
              badge.color
            )}
          >
            {index === 0 ? <Trophy className="w-3 h-3" /> : badge.label}
          </div>
        ) : (
          <span className="text-sm font-mono font-semibold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>

      {/* Avatar + name */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn("text-xs font-bold", avatarColor)}>
          {entry.avatar}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{entry.username}</p>
        <p className="text-[10px] text-muted-foreground">{entry.trades} trades</p>
      </div>

      {/* Portfolio value */}
      <div className="text-right shrink-0">
        <p className="font-mono text-sm font-semibold text-foreground">
          ₹{(entry.portfolioValue / 100000).toFixed(1)}L
        </p>
        <div
          className={cn(
            "flex items-center justify-end gap-0.5 text-[10px] font-mono font-semibold mt-0.5",
            isPositive ? "text-fin-gain" : "text-fin-loss"
          )}
        >
          {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {isPositive ? "+" : ""}
          {returnPct.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export function LeaderboardTable() {
  const liveLeaderboard = useLiveLeaderboard()

  return (
    <div className="surface-card rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Competition Leaderboard
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Live rankings across all active participants</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fin-gain/10 border border-fin-gain/20">
          <span className="w-1.5 h-1.5 rounded-full bg-fin-gain animate-pulse-soft" />
          <span className="text-[10px] font-semibold text-fin-gain">Live</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border/30">
        <div className="w-6 shrink-0" />
        <div className="w-8 shrink-0" />
        <div className="flex-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Trader</span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Value / Return
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-0.5 p-2">
        {liveLeaderboard.length > 0 ? (
          liveLeaderboard.map((entry, i) => (
            <LeaderboardRow key={`${entry.username}-${entry.rank}`} entry={entry} index={i} />
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border/40">
        <p className="text-[10px] text-muted-foreground text-center">
          Rankings update automatically every market tick based on portfolio value
        </p>
      </div>
    </div>
  )
}
