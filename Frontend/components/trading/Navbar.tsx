"use client"

import { useState } from "react"
import { Bell, Search, TrendingUp, ChevronUp, ChevronDown, Circle, Menu, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const marketIsOpen = true

function IndexPill({
  label,
  value,
  change,
  changePct,
  isPositive,
}: {
  label: string
  value: number
  change: number
  changePct: number
  isPositive: boolean
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 hover:bg-secondary transition-colors cursor-default">
      <span className="text-xs font-semibold text-muted-foreground tracking-wide">{label}</span>
      <span className="font-mono text-sm font-semibold text-foreground">
        {value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-xs font-semibold font-mono",
          isPositive ? "text-fin-gain" : "text-fin-loss"
        )}
      >
        {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {Math.abs(changePct).toFixed(2)}%
      </span>
    </div>
  )
}

export function Navbar({ hideLogo = false }: { hideLogo?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="shrink-0 z-40 w-full border-b border-border/60 backdrop-blur-xl bg-background/80">
      <div className="flex h-12 items-center gap-4 px-4 md:px-5">
        {/* Logo — only shown when not hidden (i.e. no sidebar) */}
        {!hideLogo && (
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-base font-bold text-foreground tracking-tight">TradeClub</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground leading-none">
                NSE · BSE
              </span>
            </div>
          </div>
        )}

        {/* Market status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/80 border border-border/50">
          <Circle
            className={cn(
              "w-2 h-2 fill-current",
              marketIsOpen ? "text-fin-gain animate-pulse-soft" : "text-fin-loss"
            )}
          />
          <span className={cn("text-xs font-semibold", marketIsOpen ? "text-fin-gain" : "text-fin-loss")}>
            {marketIsOpen ? "Market Open" : "Market Closed"}
          </span>
        </div>

        {/* Index pills — desktop only, shown when sidebar is not present */}
        {!hideLogo && (
          <div className="hidden lg:flex items-center gap-2 ml-1">
            <IndexPill
              label="NIFTY 50"
              value={26350.45}
              change={142.85}
              changePct={0.54}
              isPositive={true}
            />
            <IndexPill
              label="SENSEX"
              value={86214.72}
              change={476.30}
              changePct={0.56}
              isPositive={true}
            />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className={cn("transition-all duration-300", searchOpen ? "w-64" : "w-auto")}>
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search stocks, indices..."
                className="h-8 pl-8 pr-8 text-sm bg-secondary/80 border-border/60 focus:border-primary/50 w-full"
                onBlur={() => setSearchOpen(false)}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border/40 hover:border-border/70"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Search stocks...</span>
              <kbd className="hidden sm:inline text-[10px] font-mono px-1 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-fin-loss" />
          <span className="sr-only">Notifications</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border/50">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              AM
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-xs font-semibold text-foreground">Arjun Mehta</span>
            <span className="text-[10px] text-muted-foreground">Rank #1</span>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary/80 transition-colors text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile expanded */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 px-4 py-3 flex flex-col gap-2 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/80 border border-border/50 w-fit">
            <Circle
              className={cn(
                "w-2 h-2 fill-current",
                marketIsOpen ? "text-fin-gain animate-pulse-soft" : "text-fin-loss"
              )}
            />
            <span className={cn("text-xs font-semibold", marketIsOpen ? "text-fin-gain" : "text-fin-loss")}>
              {marketIsOpen ? "Market Open" : "Market Closed"}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <IndexPill label="NIFTY 50" value={26350.45} change={142.85} changePct={0.54} isPositive={true} />
            <IndexPill label="SENSEX" value={86214.72} change={476.30} changePct={0.56} isPositive={true} />
          </div>
        </div>
      )}
    </header>
  )
}
