"use client";

import { useState } from "react";
import {
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Trophy,
  Zap,
  ChevronLeft,
  ChevronRight,
  Circle,
  Wallet,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
//import { useMarketSimulator } from "@/hooks/useMarketSimulator";
import { Navbar } from "./Navbar";
import { PortfolioCard } from "./PortfolioCard";
import { MarketIndexCard } from "./MarketIndexCard";
import { Watchlist } from "./Watchlist";
import { StockChart } from "./StockChart";
import { TradingWidget } from "./TradingWidget";
import { LeaderboardTable } from "./LeaderboardTable";
import { ActivityFeed } from "./ActivityFeed";
import { CompetitionControlPanel } from "./CompetitionControlPanel";
import {
  marketIndices,
  portfolioSummary,
  watchlistStocks,
} from "@/lib/mock-data";
import { usePortfolio, useCashBalance } from "@/store/useTradeStore";
import { useEffect } from "react";
import { connectWebSocket } from "@/services/websocket";
import { useTradeStore } from "@/store/useTradeStore";
// ── Spark data ───────────────────────────────────────────────────────────────
const portfolioSparkData = [
  { v: 1380000 },
  { v: 1395000 },
  { v: 1388000 },
  { v: 1410000 },
  { v: 1405000 },
  { v: 1430000 },
  { v: 1448000 },
  { v: 1462000 },
  { v: 1482650 },
];
const cashSparkData = [
  { v: 260000 },
  { v: 255000 },
  { v: 270000 },
  { v: 252000 },
  { v: 258000 },
  { v: 248000 },
  { v: 252000 },
  { v: 250000 },
  { v: 247500 },
];

// ── Nav config ───────────────────────────────────────────────────────────────
type View = "trade" | "portfolio" | "markets" | "leaderboard" | "activity";

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "trade", label: "Trade", icon: TrendingUp },
  { id: "portfolio", label: "Portfolio", icon: LayoutDashboard },
  { id: "markets", label: "Markets", icon: BarChart2 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "activity", label: "Activity", icon: Zap },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeView,
  onViewChange,
  collapsed,
  onToggle,
}: {
  activeView: View;
  onViewChange: (v: View) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 h-full border-r border-border/60 bg-sidebar transition-all duration-300 overflow-hidden",
        collapsed ? "w-14" : "w-52",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border/60 shrink-0 px-3 gap-2.5",
          collapsed && "justify-center",
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <TrendingUp
            className="w-4 h-4 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-bold text-foreground tracking-tight">
              TradeClub
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground leading-none">
              NSE · BSE
            </span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-150 text-left w-full group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-transparent",
              )}
            >
              <Icon
                className={cn("w-4 h-4 shrink-0", isActive && "text-primary")}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {collapsed && <span className="sr-only">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Market status pill */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="rounded-xl bg-fin-surface border border-border/50 p-3 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-fin-gain text-fin-gain animate-pulse-soft" />
              <span className="text-xs font-semibold text-fin-gain">
                Market Open
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {marketIndices.slice(0, 2).map((idx) => (
                <div
                  key={idx.symbol}
                  className="flex items-center justify-between"
                >
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {idx.symbol}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-mono font-semibold text-foreground">
                      {idx.value.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-mono font-semibold flex items-center gap-0.5",
                        idx.isPositive ? "text-fin-gain" : "text-fin-loss",
                      )}
                    >
                      {idx.isPositive ? (
                        <ChevronUp className="w-2.5 h-2.5" />
                      ) : (
                        <ChevronDown className="w-2.5 h-2.5" />
                      )}
                      {Math.abs(idx.changePct).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-border/60 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}

// ── Mobile bottom bar ────────────────────────────────────────────────────────
function MobileNav({
  activeView,
  onViewChange,
}: {
  activeView: View;
  onViewChange: (v: View) => void;
}) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex h-14 border-t border-border/60 bg-background/95 backdrop-blur-xl">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = activeView === id;
        return (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[9px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── View: Trade ──────────────────────────────────────────────────────────────
function TradeView({
  selectedStockId,
  onSelectStock,
}: {
  selectedStockId: string;
  onSelectStock: (id: string) => void;
}) {
  return (
    <div className="flex h-full gap-3 min-h-0">
      {/* Left: Watchlist */}
      <div className="w-64 shrink-0 flex flex-col min-h-0">
        <Watchlist
          selectedStockId={selectedStockId}
          onSelectStock={onSelectStock}
        />
      </div>
      {/* Center: Chart */}
      <div className="flex-1 flex flex-col min-h-0">
        <StockChart
          selectedStockId={selectedStockId}
          watchlistStocks={watchlistStocks}
        />
      </div>
      {/* Right: Trading widget */}
      <div className="w-64 shrink-0 flex flex-col min-h-0">
        <TradingWidget
          selectedStockId={selectedStockId}
          watchlistStocksData={watchlistStocks}
        />
      </div>
    </div>
  );
}

// ── View: Portfolio ──────────────────────────────────────────────────────────
function PortfolioView() {
  const loadDatabaseData = useTradeStore((s) => s.loadDatabaseData);
  const holdings = usePortfolio();
  const cashBalance = useCashBalance();
  console.log("HOLDINGS LIVE:", holdings);
  const totalInvested = holdings.reduce((s, h) => s + h.investedValue, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-full pb-4">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-1">
          Portfolio Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Your holdings and performance at a glance.
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <PortfolioCard
          title="Portfolio Value"
          value={totalCurrent}
          change={totalPnl}
          changePct={totalPnlPct}
          isPositive={totalPnl >= 0}
          icon="portfolio"
          sparkData={portfolioSparkData}
          isCurrency={true}
        />
        <PortfolioCard
          title="Available Cash"
          value={cashBalance}
          icon="cash"
          sparkData={cashSparkData}
          isPositive={true}
          subtitle="Ready to deploy"
          isCurrency={true}
        />
        <PortfolioCard
          title="Unrealised P&L"
          value={Math.abs(totalPnl)}
          change={totalPnl}
          changePct={totalPnlPct}
          isPositive={totalPnl >= 0}
          icon="pnl"
          isCurrency={true}
        />
        <PortfolioCard
          title="Total Holdings"
          value={holdings.length}
          change={totalPnl}
          changePct={totalPnlPct}
          isPositive={totalPnl >= 0}
          icon="holdings"
          subtitle="Across active positions"
          isCurrency={false}
        />
      </div>

      {/* Holdings table — sourced from store, no Math.random() */}
      <div className="surface-card rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between shrink-0">
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Current Holdings
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            {holdings.length} positions
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b border-border/30 sticky top-0 bg-fin-surface shrink-0">
          {["Stock", "Qty", "Avg Price", "LTP", "P&L", "Return"].map((h) => (
            <div key={h} className="px-5 py-2.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {h}
              </span>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {holdings.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No holdings yet. Place your first trade.
              </p>
            </div>
          ) : (
            holdings.map((h, i) => (
              <div
                key={h.stockId}
                className={cn(
                  "grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border/20 hover:bg-fin-surface-hover transition-colors",
                  i % 2 === 0 ? "bg-transparent" : "bg-secondary/20",
                )}
              >
                <div className="px-5 py-3">
                  <p className="font-mono text-xs font-bold text-foreground">
                    {h.symbol}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {h.companyName}
                  </p>
                </div>
                <div className="px-5 py-3 flex items-center">
                  <span className="font-mono text-xs text-foreground">
                    {h.quantity}
                  </span>
                </div>
                <div className="px-5 py-3 flex items-center">
                  <span className="font-mono text-xs text-foreground">
                    ₹{h.avgBuyPrice.toFixed(2)}
                  </span>
                </div>
                <div className="px-5 py-3 flex items-center">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold",
                      h.isPositive ? "text-fin-gain" : "text-fin-loss",
                    )}
                  >
                    ₹{h.ltp.toFixed(2)}
                  </span>
                </div>
                <div className="px-5 py-3 flex items-center">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold",
                      h.isPositive ? "text-fin-gain" : "text-fin-loss",
                    )}
                  >
                    {h.pnl >= 0 ? "+" : ""}₹{Math.abs(h.pnl).toFixed(0)}
                  </span>
                </div>
                <div className="px-5 py-3 flex items-center">
                  <span
                    className={cn(
                      "text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded",
                      h.isPositive
                        ? "bg-fin-gain/15 text-fin-gain"
                        : "bg-fin-loss/15 text-fin-loss",
                    )}
                  >
                    {h.pnlPct >= 0 ? "+" : ""}
                    {h.pnlPct.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── View: Markets ────────────────────────────────────────────────────────────
function MarketsView() {
  const liveIndices = useTradeStore((s) => s.liveIndices);
  console.log("LIVE INDICES", liveIndices);
  return (
    <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-full pb-4">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-1">
          Market Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Indices and sector performance across NSE &amp; BSE.
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {liveIndices.map((index) => (
          <MarketIndexCard key={index.symbol} index={index} />
        ))}
      </div>
      {/* Sector heatmap placeholder */}
      <div className="surface-card rounded-xl p-5 flex-1">
        <h3 className="font-display font-semibold text-sm text-foreground mb-4">
          Sector Heatmap
        </h3>
        <div className="grid grid-cols-4 gap-2 h-full">
          {[
            { name: "IT", change: 1.42, stocks: 15 },
            { name: "Banking", change: -0.68, stocks: 22 },
            { name: "FMCG", change: 0.31, stocks: 18 },
            { name: "Auto", change: 2.14, stocks: 12 },
            { name: "Pharma", change: -1.05, stocks: 20 },
            { name: "Energy", change: 0.88, stocks: 8 },
            { name: "Metals", change: -0.44, stocks: 11 },
            { name: "Telecom", change: 1.67, stocks: 6 },
          ].map((s) => {
            const intensity = Math.min(Math.abs(s.change) / 2.5, 1);
            const isPos = s.change >= 0;
            return (
              <div
                key={s.name}
                className={cn(
                  "rounded-xl p-4 flex flex-col justify-between cursor-default transition-all duration-150 hover:opacity-90",
                  isPos
                    ? "bg-fin-gain/10 border border-fin-gain/20"
                    : "bg-fin-loss/10 border border-fin-loss/20",
                )}
                style={{ opacity: 0.55 + intensity * 0.45 }}
              >
                <span className="font-display font-bold text-sm text-foreground">
                  {s.name}
                </span>
                <div>
                  <p
                    className={cn(
                      "font-mono text-base font-bold",
                      isPos ? "text-fin-gain" : "text-fin-loss",
                    )}
                  >
                    {isPos ? "+" : ""}
                    {s.change.toFixed(2)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {s.stocks} stocks
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── View: Leaderboard ────────────────────────────────────────────────────────
function LeaderboardView() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-full pb-4">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-1">
          Competition Leaderboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Live rankings across all active participants.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 flex-1">
        <LeaderboardTable />
        <ActivityFeed />
      </div>
    </div>
  );
}

// ── View: Activity ───────────────────────────────────────────────────────────
function ActivityView() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-full pb-4">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-1">
          Live Activity
        </h2>
        <p className="text-sm text-muted-foreground">
          Real-time trade stream across all participants.
        </p>
      </div>
      <div className="flex-1">
        <ActivityFeed />
      </div>
    </div>
  );
}

// ── Root dashboard ───────────────────────────────────────────────────────────
export function TradingDashboard() {
  const [activeView, setActiveView] = useState<View>("trade");
  const [selectedStockId, setSelectedStockId] = useState("reliance");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const loadDatabaseData = useTradeStore((s) => s.loadDatabaseData);

  useEffect(() => {
    connectWebSocket();
    loadDatabaseData();
  }, []);
  // Start the frontend-only market simulator (respects market pause/speed controls)
  //useMarketSimulator();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top bar — slim on desktop (logo is in sidebar) */}
      <Navbar hideLogo />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Competition Control Panel */}
          <CompetitionControlPanel />

          {/* Breadcrumb bar */}
          <div className="shrink-0 h-10 border-b border-border/40 flex items-center px-5 gap-2">
            <span className="text-xs text-muted-foreground">TradeClub</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs font-semibold text-foreground capitalize">
              {activeView}
            </span>
          </div>

          {/* View area — fills remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden p-4">
            {activeView === "trade" && (
              <TradeView
                selectedStockId={selectedStockId}
                onSelectStock={setSelectedStockId}
              />
            )}
            {activeView === "portfolio" && <PortfolioView />}
            {activeView === "markets" && <MarketsView />}
            {activeView === "leaderboard" && <LeaderboardView />}
            {activeView === "activity" && <ActivityView />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav activeView={activeView} onViewChange={setActiveView} />

      {/* Mobile bottom padding */}
      <div className="md:hidden h-14 shrink-0" />
    </div>
  );
}
