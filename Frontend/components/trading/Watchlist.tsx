"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WatchlistStock } from "@/lib/mock-data"
import { watchlistStocks } from "@/lib/mock-data"
import { useStockPrices } from "@/store/useTradeStore"

interface WatchlistRowProps {
  stock: WatchlistStock
  livePrice: { ltp: number; change: number; changePct: number; isPositive: boolean } | null
  isSelected: boolean
  onClick: () => void
}

function WatchlistRow({ stock, livePrice, isSelected, onClick }: WatchlistRowProps) {
  const displayPrice = livePrice || stock
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group",
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-fin-surface-hover border border-transparent hover:border-border/40"
      )}
    >
      {/* Symbol + name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-mono text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
            {stock.symbol}
          </span>
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-soft",
              displayPrice.isPositive ? "bg-fin-gain" : "bg-fin-loss"
            )}
          />
        </div>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5 leading-none">{stock.companyName}</p>
      </div>

      {/* LTP */}
      <div className="text-right shrink-0">
        <p className="font-mono text-sm font-semibold text-foreground">
          ₹{displayPrice.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
        <div
          className={cn(
            "flex items-center justify-end gap-0.5 text-[10px] font-mono font-semibold mt-0.5",
            displayPrice.isPositive ? "text-fin-gain" : "text-fin-loss"
          )}
        >
          {displayPrice.isPositive ? (
            <TrendingUp className="w-2.5 h-2.5" />
          ) : (
            <TrendingDown className="w-2.5 h-2.5" />
          )}
          {displayPrice.isPositive ? "+" : ""}
          {displayPrice.changePct.toFixed(2)}%
        </div>
      </div>
    </button>
  )
}

interface WatchlistProps {
  selectedStockId: string
  onSelectStock: (id: string) => void
}

export function Watchlist({ selectedStockId, onSelectStock }: WatchlistProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const stockPrices = useStockPrices()

  const filtered = watchlistStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const gainers = filtered.filter((s) => stockPrices[s.id]?.isPositive ?? s.isPositive).length
  const losers = filtered.filter((s) => !(stockPrices[s.id]?.isPositive ?? s.isPositive)).length

  return (
    <div className="surface-card rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground">Watchlist</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              <span className="text-fin-gain font-semibold">{gainers} up</span>
              {" · "}
              <span className="text-fin-loss font-semibold">{losers} down</span>
            </p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-secondary/60 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-secondary/80 transition-colors"
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
        <div className="flex-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Symbol</span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">LTP / Chg%</span>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-2 py-1.5 flex flex-col gap-0.5">
        {filtered.length > 0 ? (
          filtered.map((stock) => (
            <WatchlistRow
              key={stock.id}
              stock={stock}
              livePrice={stockPrices[stock.id] || null}
              isSelected={selectedStockId === stock.id}
              onClick={() => onSelectStock(stock.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No stocks found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/40 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {filtered.length} of {watchlistStocks.length} stocks
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">
          Updated live
        </span>
      </div>
    </div>
  )
}
