// ─────────────────────────────────────────────────────────────────────────────
// Core domain types for the TradeClub mock trading platform
// ─────────────────────────────────────────────────────────────────────────────

/** A tradeable stock listed on NSE / BSE */
export interface Stock {
  id: string
  symbol: string
  companyName: string
  exchange: "NSE" | "BSE"
  ltp: number          // Last traded price
  change: number       // Absolute change from prev close
  changePct: number    // Percentage change
  isPositive: boolean
  open: number
  high: number
  low: number
  prevClose: number
  volume: string       // Formatted string e.g. "8.4M"
  marketCap?: string   // Formatted string e.g. "₹19.97L Cr"
  pe?: number
  eps?: number
  sector?: string
}

/** A single holding in a user's portfolio */
export interface PortfolioHolding {
  stockId: string
  symbol: string
  companyName: string
  quantity: number
  avgBuyPrice: number
  ltp: number          // Current market price (synced from stock data)
  currentValue: number // quantity × ltp
  investedValue: number // quantity × avgBuyPrice
  pnl: number          // currentValue − investedValue
  pnlPct: number       // (pnl / investedValue) × 100
  isPositive: boolean
}

/** A completed or pending simulated order / transaction */
export interface Transaction {
  id: string
  stockId: string
  symbol: string
  companyName: string
  action: "buy" | "sell"
  quantity: number
  price: number        // Execution price per share
  orderType: "market" | "limit"
  exchange: "NSE" | "BSE"
  timestamp: string    // ISO 8601 string
  totalValue: number   // quantity × price
  status: "executed" | "pending" | "cancelled"
}

/** A participant in the trading competition */
export interface LeaderboardUser {
  rank: number
  username: string
  avatar: string        // 2-letter initials
  portfolioValue: number
  cashBalance: number
  investedValue: number
  totalReturn: number   // (portfolioValue + cashBalance) − startingCapital
  returnPct: number
  trades: number
  badge?: "gold" | "silver" | "bronze"
}
