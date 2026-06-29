import { create } from "zustand";
import type {
  PortfolioHolding,
  Transaction,
  MarketIndex,
} from "@/lib/mock-data";
import type { LeaderboardEntry } from "@/lib/mock-data";
import {
  initialHoldings,
  initialTransactions,
  portfolioSummary,
  watchlistStocks,
  marketIndices as initialMarketIndices,
  leaderboard as initialLeaderboard,
} from "@/lib/mock-data";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LiveStockPrice {
  ltp: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
  isPositive: boolean;
}

interface PlaceTradePayload {
  stockId: string;
  action: "buy" | "sell";
  quantity: number;
  price: number;
  orderType: "market" | "limit";
  exchange: "NSE" | "BSE";
}

interface TradeStore {
  // ── Static / identity ────────────────────────────────────────────────────
  selectedStockId: string;

  // ── Live prices (updated by simulator every second) ───────────────────
  /** stockId → live price snapshot */
  stockPrices: Record<string, LiveStockPrice>;

  /** Live market index values */
  liveIndices: MarketIndex[];

  /** Live leaderboard (portfolio values drift with market) */
  liveLeaderboard: LeaderboardEntry[];

  // ── Portfolio ─────────────────────────────────────────────────────────────
  cashBalance: number;
  portfolio: PortfolioHolding[];
  transactions: Transaction[];
  loadDatabaseData: () => Promise<void>;
  // ── Competition Control ──────────────────────────────────────────────────
  marketRunning: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
  simulationTick: number; // Total ticks since start
  totalTradesExecuted: number;

  // ── Derived helpers ──────────────────────────────────────────────────────
  portfolioValue: () => number;
  investedValue: () => number;
  unrealisedPnL: () => number;

  // ── Actions ──────────────────────────────────────────────────────────────
  setSelectedStockId: (id: string) => void;

  /**
   * Called by the market simulator every second.
   * Updates all stock prices, recalculates portfolio holdings & leaderboard.
   */
  tickMarket: () => void;
  updateMarketData: (
    prices: Record<string, number>,
    indices: Record<string, number>,
  ) => void;
  placeTrade: (payload: PlaceTradePayload) => { ok: boolean; reason?: string };

  // ── Competition Control Actions ──────────────────────────────────────────
  startMarket: () => void;
  pauseMarket: () => void;
  setSimulationSpeed: (speed: 1 | 2 | 5) => void;
  resetCompetition: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Gaussian-ish random using Box-Muller — more realistic than uniform */
function randn(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/** Nudge a price with a realistic micro-movement (σ ≈ 0.05% per tick) */
function nudgePrice(current: number, volatility = 0.0005): number {
  const delta = current * volatility * randn();
  return Math.max(1, +(current + delta).toFixed(2));
}

/** Build the initial stockPrices map from watchlistStocks */
function buildInitialPrices(): Record<string, LiveStockPrice> {
  return Object.fromEntries(
    watchlistStocks.map((s) => [
      s.id,
      {
        ltp: s.ltp,
        change: s.change,
        changePct: s.changePct,
        high: s.high,
        low: s.low,
        volume: parseInt(s.volume.replace(/[^\d]/g, "")) || 1000000,
        isPositive: s.isPositive,
      } satisfies LiveStockPrice,
    ]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useTradeStore = create<TradeStore>((set, get) => ({
  // ── Initial state ─────────────────────────────────────────────────────────
  selectedStockId: "reliance",
  cashBalance: 0,
  portfolio: [],
  transactions: [],
  stockPrices: buildInitialPrices(),
  liveIndices: initialMarketIndices,
  liveLeaderboard: initialLeaderboard,
  marketRunning: true,
  simulationSpeed: 1,
  simulationTick: 0,
  totalTradesExecuted: initialTransactions.length,

  // ── Derived helpers ───────────────────────────────────────────────────────
  portfolioValue: () => get().portfolio.reduce((s, h) => s + h.currentValue, 0),
  investedValue: () => get().portfolio.reduce((s, h) => s + h.investedValue, 0),
  unrealisedPnL: () => get().portfolio.reduce((s, h) => s + h.pnl, 0),

  // ── Actions ───────────────────────────────────────────────────────────────
  setSelectedStockId: (id) => set({ selectedStockId: id }),

  tickMarket: () => {
    set((s) => {
      // 1. Nudge every stock price
      const nextPrices: Record<string, LiveStockPrice> = {};
      for (const [id, snap] of Object.entries(s.stockPrices)) {
        const stock = watchlistStocks.find((w) => w.id === id)!;
        const newLtp = nudgePrice(snap.ltp);
        const newChange = +(newLtp - stock.prevClose).toFixed(2);
        const newChangePct = +((newChange / stock.prevClose) * 100).toFixed(2);
        nextPrices[id] = {
          ltp: newLtp,
          change: newChange,
          changePct: newChangePct,
          high: Math.max(snap.high, newLtp),
          low: Math.min(snap.low, newLtp),
          volume: snap.volume + Math.floor(Math.random() * 1200),
          isPositive: newChange >= 0,
        };
      }

      // 2. Recompute portfolio holdings against new prices
      const nextPortfolio = s.portfolio.map((h) => {
        const price = nextPrices[h.stockId];
        if (!price) return h;
        const currentValue = h.quantity * price.ltp;
        const pnl = currentValue - h.investedValue;
        const pnlPct = (pnl / h.investedValue) * 100;
        return {
          ...h,
          ltp: price.ltp,
          currentValue,
          pnl,
          pnlPct,
          isPositive: pnl >= 0,
        };
      });

      // 3. Nudge market indices (smaller σ — index moves smoother than stocks)
      const nextIndices = s.liveIndices.map((idx) => {
        const newVal = nudgePrice(idx.value, 0.0003);
        const base = initialMarketIndices.find((i) => i.symbol === idx.symbol)!;
        const newChange = +(newVal - base.value + idx.change).toFixed(2);
        const newChangePct = +(
          (newChange / (base.value - idx.change)) *
          100
        ).toFixed(2);
        return {
          ...idx,
          value: newVal,
          change: newChange,
          changePct: newChangePct,
          isPositive: newChange >= 0,
          sparkline: [...idx.sparkline.slice(1), +newVal.toFixed(0)],
        };
      });

      // 4. Drift leaderboard values (small ± random walk on portfolioValue)
      const nextLeaderboard = s.liveLeaderboard.map((entry) => {
        const drift = entry.portfolioValue * 0.0003 * randn();
        const newVal = Math.max(
          1_000_000,
          +(entry.portfolioValue + drift).toFixed(0),
        );
        const newReturn = newVal - (entry.portfolioValue - entry.totalReturn);
        const newReturnPct = +(
          (newReturn / (entry.portfolioValue - entry.totalReturn + 0.01)) *
          100
        ).toFixed(2);
        return {
          ...entry,
          portfolioValue: newVal,
          totalReturn: Math.max(0, +newReturn.toFixed(0)),
          returnPct: newReturnPct,
        };
      });

      // 5. Resort leaderboard by portfolioValue (highest first) and update ranks
      const sortedLeaderboard = [...nextLeaderboard].sort(
        (a, b) => b.portfolioValue - a.portfolioValue,
      );
      const rankedLeaderboard = sortedLeaderboard.map((entry, i) => ({
        ...entry,
        rank: i + 1,
      }));

      return {
        stockPrices: nextPrices,
        portfolio: nextPortfolio,
        liveIndices: nextIndices,
        liveLeaderboard: rankedLeaderboard,
        simulationTick: s.simulationTick + 1,
      };
    });
  },
  updateMarketData: (
    prices: Record<string, number>,
    indices: Record<string, number>,
  ) => {
    set((s) => {
      console.log("PRICE UPDATE:", prices);
      const nextPrices = { ...s.stockPrices };

      Object.entries(prices).forEach(([id, price]) => {
        if (nextPrices[id]) {
          nextPrices[id] = {
            ...nextPrices[id],
            ltp: price,
          };
        }
      });

      const nextPortfolio = s.portfolio.map((h) => {
        const price = nextPrices[h.stockId];
        if (!price) return h;

        const currentValue = h.quantity * price.ltp;
        const pnl = currentValue - h.investedValue;
        const pnlPct = (pnl / h.investedValue) * 100;

        return {
          ...h,
          ltp: price.ltp,
          currentValue,
          pnl,
          pnlPct,
          isPositive: pnl >= 0,
        };
      });
      const nextIndices = s.liveIndices.map((idx) => {
        const value = indices[idx.symbol] ?? idx.value;

        const change = value - idx.value;
        const changePct = (change / idx.value) * 100;

        return {
          ...idx,
          value,
          change,
          changePct,
          isPositive: change >= 0,
          sparkline: [...idx.sparkline.slice(1), value],
        };
      });
      return {
        stockPrices: nextPrices,
        portfolio: nextPortfolio,
        liveIndices: nextIndices,
      };
    });
  },
  placeTrade: ({ stockId, action, quantity, price, orderType, exchange }) => {
    const state = get();
    const stock = watchlistStocks.find((s) => s.id === stockId);
    if (!stock) return { ok: false, reason: "Stock not found." };
    if (quantity < 1)
      return { ok: false, reason: "Quantity must be at least 1." };

    const totalCost = quantity * price;

    if (action === "buy") {
      if (state.cashBalance < totalCost) {
        return {
          ok: false,
          reason: `Insufficient cash. Need ₹${totalCost.toFixed(2)}, available ₹${state.cashBalance.toFixed(2)}.`,
        };
      }

      set((s) => {
        const existing = s.portfolio.find((h) => h.stockId === stockId);
        const livePrice = s.stockPrices[stockId]?.ltp ?? stock.ltp;
        let updatedPortfolio: PortfolioHolding[];

        if (existing) {
          const newQty = existing.quantity + quantity;
          const newAvg = (existing.investedValue + totalCost) / newQty;
          const newInvested = newQty * newAvg;
          const newCurrent = newQty * livePrice;
          const newPnl = newCurrent - newInvested;
          updatedPortfolio = s.portfolio.map((h) =>
            h.stockId === stockId
              ? {
                  ...h,
                  quantity: newQty,
                  avgBuyPrice: +newAvg.toFixed(2),
                  currentValue: +newCurrent.toFixed(2),
                  investedValue: +newInvested.toFixed(2),
                  pnl: +newPnl.toFixed(2),
                  pnlPct: +((newPnl / newInvested) * 100).toFixed(2),
                  isPositive: newPnl >= 0,
                }
              : h,
          );
        } else {
          const currentValue = quantity * livePrice;
          const investedValue = quantity * price;
          const pnl = currentValue - investedValue;
          const newHolding: PortfolioHolding = {
            stockId,
            symbol: stock.symbol,
            companyName: stock.companyName,
            quantity,
            avgBuyPrice: price,
            ltp: livePrice,
            currentValue: +currentValue.toFixed(2),
            investedValue: +investedValue.toFixed(2),
            pnl: +pnl.toFixed(2),
            pnlPct: +((pnl / investedValue) * 100).toFixed(2),
            isPositive: pnl >= 0,
          };
          updatedPortfolio = [...s.portfolio, newHolding];
        }

        const newTx: Transaction = {
          id: `t${Date.now()}`,
          stockId,
          symbol: stock.symbol,
          companyName: stock.companyName,
          action: "buy",
          quantity,
          price,
          orderType,
          exchange,
          timestamp: new Date().toISOString(),
          totalValue: totalCost,
          status: "executed",
        };

        return {
          cashBalance: +(s.cashBalance - totalCost).toFixed(2),
          portfolio: updatedPortfolio,
          transactions: [newTx, ...s.transactions],
          totalTradesExecuted: s.totalTradesExecuted + 1,
        };
      });
      return { ok: true };
    }

    // Sell case below
    // sell
    const existing = state.portfolio.find((h) => h.stockId === stockId);
    if (!existing)
      return { ok: false, reason: "You do not hold any shares of this stock." };
    if (existing.quantity < quantity) {
      return {
        ok: false,
        reason: `Insufficient shares. You hold ${existing.quantity}, trying to sell ${quantity}.`,
      };
    }

    const proceeds = quantity * price;

    set((s) => {
      const holding = s.portfolio.find((h) => h.stockId === stockId)!;
      const livePrice = s.stockPrices[stockId]?.ltp ?? stock.ltp;
      const newQty = holding.quantity - quantity;
      let updatedPortfolio: PortfolioHolding[];

      if (newQty === 0) {
        updatedPortfolio = s.portfolio.filter((h) => h.stockId !== stockId);
      } else {
        const newInvested = newQty * holding.avgBuyPrice;
        const newCurrent = newQty * livePrice;
        const newPnl = newCurrent - newInvested;
        updatedPortfolio = s.portfolio.map((h) =>
          h.stockId === stockId
            ? {
                ...h,
                quantity: newQty,
                currentValue: +newCurrent.toFixed(2),
                investedValue: +newInvested.toFixed(2),
                pnl: +newPnl.toFixed(2),
                pnlPct: +((newPnl / newInvested) * 100).toFixed(2),
                isPositive: newPnl >= 0,
              }
            : h,
        );
      }

      const newTx: Transaction = {
        id: `t${Date.now()}`,
        stockId,
        symbol: stock.symbol,
        companyName: stock.companyName,
        action: "sell",
        quantity,
        price,
        orderType,
        exchange,
        timestamp: new Date().toISOString(),
        totalValue: proceeds,
        status: "executed",
      };

      return {
        cashBalance: +(s.cashBalance + proceeds).toFixed(2),
        portfolio: updatedPortfolio,
        transactions: [newTx, ...s.transactions],
        totalTradesExecuted: s.totalTradesExecuted + 1,
      };
    });
    return { ok: true };
  },
  loadDatabaseData: async () => {
    const USER_ID = "ad3366a1-1916-4fcd-b30d-628f18ecba2d";

    const { loadUser } = await import("@/lib/loadUser");
    const { loadPortfolio } = await import("@/lib/loadPortfolio");

    const user = await loadUser(USER_ID);
    const portfolio = await loadPortfolio();
    console.log("USER:", user);
    console.log("PORTFOLIO:", portfolio);
    set({
      cashBalance: user?.cash_balance || 0,
      portfolio: portfolio || [],
    });
  },
  // ── Competition Control Actions ──────────────────────────────────────────
  startMarket: () => set({ marketRunning: true }),
  pauseMarket: () => set({ marketRunning: false }),
  setSimulationSpeed: (speed: 1 | 2 | 5) => set({ simulationSpeed: speed }),

  resetCompetition: () =>
    set({
      // Reset portfolio to initial state
      selectedStockId: "reliance",
      cashBalance: 0,
      portfolio: [],
      transactions: [],
      stockPrices: buildInitialPrices(),
      liveIndices: initialMarketIndices,
      liveLeaderboard: initialLeaderboard.map((e, i) => ({
        ...e,
        rank: i + 1,
      })),
      // Reset competition state
      marketRunning: true,
      simulationSpeed: 1,
      simulationTick: 0,
      totalTradesExecuted: initialTransactions.length,
    }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Selector hooks — granular to avoid unnecessary re-renders
// ─────────────────────────────────────────────────────────────────────────────

export const useSelectedStockId = () => useTradeStore((s) => s.selectedStockId);
export const useCashBalance = () => useTradeStore((s) => s.cashBalance);
export const usePortfolio = () => useTradeStore((s) => s.portfolio);
export const useTransactions = () => useTradeStore((s) => s.transactions);
export const usePlaceTrade = () => useTradeStore((s) => s.placeTrade);
export const useStockPrices = () => useTradeStore((s) => s.stockPrices);
export const useLiveIndices = () => useTradeStore((s) => s.liveIndices);
export const useLiveLeaderboard = () => useTradeStore((s) => s.liveLeaderboard);
export const useTickMarket = () => useTradeStore((s) => s.tickMarket);
export const useMarketRunning = () => useTradeStore((s) => s.marketRunning);
export const useSimulationSpeed = () => useTradeStore((s) => s.simulationSpeed);
export const useSimulationTick = () => useTradeStore((s) => s.simulationTick);
export const useTotalTrades = () => useTradeStore((s) => s.totalTradesExecuted);
export const useStartMarket = () => useTradeStore((s) => s.startMarket);
export const usePauseMarket = () => useTradeStore((s) => s.pauseMarket);
export const useSetSimulationSpeed = () =>
  useTradeStore((s) => s.setSimulationSpeed);
export const useResetCompetition = () =>
  useTradeStore((s) => s.resetCompetition);

/** Single stock live price by id */
export const useStockPrice = (id: string) =>
  useTradeStore((s) => s.stockPrices[id]);
