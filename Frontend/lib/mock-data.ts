import type { Stock, PortfolioHolding, Transaction, LeaderboardUser } from "@/types"

// ─────────────────────────────────────────────────────────────────────────────
// Re-export canonical types (for backward compat with existing component imports)
// ─────────────────────────────────────────────────────────────────────────────
export type { Stock, PortfolioHolding, Transaction, LeaderboardUser }

// ─────────────────────────────────────────────────────────────────────────────
// Legacy interface aliases kept for components that still use them by name
// ─────────────────────────────────────────────────────────────────────────────
export interface MarketIndex {
  name: string
  symbol: string
  value: number
  change: number
  changePct: number
  isPositive: boolean
  sparkline: number[]
}

/** Alias — components using WatchlistStock continue to work unchanged */
export type WatchlistStock = Stock

export interface PortfolioSummary {
  portfolioValue: number
  portfolioChange: number
  portfolioChangePct: number
  availableCash: number
  todayPnL: number
  todayPnLPct: number
  totalHoldings: number
  totalReturn: number
  totalReturnPct: number
}

export interface ChartDataPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

/** OHLCV bar keyed by Unix timestamp (seconds) — required by lightweight-charts */
export interface OHLCBar {
  time: number  // Unix seconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TradeActivity {
  id: string
  user: string
  action: "bought" | "sold"
  quantity: number
  stock: string
  price: number
  timestamp: string
  special?: string
}

/** Alias — components using LeaderboardEntry continue to work unchanged */
export type LeaderboardEntry = LeaderboardUser & {
  /** Not used by LeaderboardUser but kept for any component that referenced it */
  avatar: string
}

export interface StockDetail {
  symbol: string
  companyName: string
  exchange: string
  ltp: number
  change: number
  changePct: number
  open: number
  high: number
  low: number
  prevClose: number
  volume: string
  marketCap: string
  pe: number
  eps: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Market Indices
// ─────────────────────────────────────────────────────────────────────────────

export const marketIndices: MarketIndex[] = [
  {
    name: "NIFTY 50",
    symbol: "NIFTY",
    value: 26350.45,
    change: 142.85,
    changePct: 0.54,
    isPositive: true,
    sparkline: [26100, 26150, 26080, 26200, 26180, 26250, 26310, 26290, 26350],
  },
  {
    name: "SENSEX",
    symbol: "SENSEX",
    value: 86214.72,
    change: 476.30,
    changePct: 0.56,
    isPositive: true,
    sparkline: [85600, 85700, 85620, 85850, 85800, 85950, 86100, 86050, 86214],
  },
  {
    name: "BANK NIFTY",
    symbol: "BANKNIFTY",
    value: 55482.30,
    change: -218.60,
    changePct: -0.39,
    isPositive: false,
    sparkline: [55800, 55750, 55700, 55680, 55720, 55600, 55550, 55500, 55482],
  },
  {
    name: "FIN NIFTY",
    symbol: "FINNIFTY",
    value: 24118.65,
    change: -89.40,
    changePct: -0.37,
    isPositive: false,
    sparkline: [24250, 24210, 24200, 24180, 24160, 24140, 24130, 24120, 24118],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Summary
// ─────────────────────────────────────────────────────────────────────────────

export const portfolioSummary: PortfolioSummary = {
  portfolioValue: 1482650.75,
  portfolioChange: 18420.50,
  portfolioChangePct: 1.26,
  availableCash: 247500.00,
  todayPnL: 11845.30,
  todayPnLPct: 0.81,
  totalHoldings: 12,
  totalReturn: 234850.75,
  totalReturnPct: 18.83,
}

// ─────────────────────────────────────────────────────────────────────────────
// Watchlist / Stock catalogue
// ─────────────────────────────────────────────────────────────────────────────

export const watchlistStocks: Stock[] = [
  {
    id: "reliance",
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    exchange: "NSE",
    ltp: 2948.55,
    change: 34.20,
    changePct: 1.17,
    isPositive: true,
    open: 2915.00,
    high: 2962.80,
    low: 2910.00,
    prevClose: 2914.35,
    volume: "8.4M",
    marketCap: "₹19.97L Cr",
    pe: 28.4,
    eps: 103.82,
    sector: "Energy",
  },
  {
    id: "tcs",
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    exchange: "NSE",
    ltp: 4218.90,
    change: -28.45,
    changePct: -0.67,
    isPositive: false,
    open: 4248.00,
    high: 4255.00,
    low: 4198.20,
    prevClose: 4247.35,
    volume: "3.1M",
    sector: "IT",
  },
  {
    id: "infy",
    symbol: "INFY",
    companyName: "Infosys",
    exchange: "NSE",
    ltp: 1876.30,
    change: 22.10,
    changePct: 1.19,
    isPositive: true,
    open: 1855.00,
    high: 1884.50,
    low: 1850.00,
    prevClose: 1854.20,
    volume: "5.7M",
    sector: "IT",
  },
  {
    id: "hdfcbank",
    symbol: "HDFCBANK",
    companyName: "HDFC Bank",
    exchange: "NSE",
    ltp: 1724.60,
    change: -15.80,
    changePct: -0.91,
    isPositive: false,
    open: 1742.00,
    high: 1748.00,
    low: 1718.30,
    prevClose: 1740.40,
    volume: "6.2M",
    sector: "Banking",
  },
  {
    id: "icicibank",
    symbol: "ICICIBANK",
    companyName: "ICICI Bank",
    exchange: "NSE",
    ltp: 1342.75,
    change: 18.35,
    changePct: 1.38,
    isPositive: true,
    open: 1325.00,
    high: 1348.00,
    low: 1320.50,
    prevClose: 1324.40,
    volume: "9.8M",
    sector: "Banking",
  },
  {
    id: "sbi",
    symbol: "SBIN",
    companyName: "State Bank of India",
    exchange: "NSE",
    ltp: 838.45,
    change: -6.20,
    changePct: -0.73,
    isPositive: false,
    open: 845.00,
    high: 849.90,
    low: 833.00,
    prevClose: 844.65,
    volume: "14.2M",
    sector: "Banking",
  },
  {
    id: "tatamotors",
    symbol: "TATAMOTORS",
    companyName: "Tata Motors",
    exchange: "NSE",
    ltp: 1024.80,
    change: 31.60,
    changePct: 3.18,
    isPositive: true,
    open: 993.00,
    high: 1038.00,
    low: 992.00,
    prevClose: 993.20,
    volume: "11.5M",
    sector: "Auto",
  },
  {
    id: "lt",
    symbol: "LT",
    companyName: "Larsen & Toubro",
    exchange: "NSE",
    ltp: 3752.25,
    change: 42.90,
    changePct: 1.16,
    isPositive: true,
    open: 3710.00,
    high: 3768.00,
    low: 3705.50,
    prevClose: 3709.35,
    volume: "2.3M",
    sector: "Infra",
  },
  {
    id: "airtel",
    symbol: "BHARTIARTL",
    companyName: "Bharti Airtel",
    exchange: "NSE",
    ltp: 1892.40,
    change: -24.55,
    changePct: -1.28,
    isPositive: false,
    open: 1918.00,
    high: 1920.00,
    low: 1886.00,
    prevClose: 1916.95,
    volume: "4.6M",
    sector: "Telecom",
  },
  {
    id: "itc",
    symbol: "ITC",
    companyName: "ITC",
    exchange: "NSE",
    ltp: 486.70,
    change: 5.30,
    changePct: 1.10,
    isPositive: true,
    open: 482.00,
    high: 489.00,
    low: 481.00,
    prevClose: 481.40,
    volume: "18.9M",
    sector: "FMCG",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Stock Detail (selected stock for chart — falls back when watchlist entry
// does not carry the full detail fields)
// ─────────────────────────────────────────────────────────────────────────────

export const selectedStock: StockDetail = {
  symbol: "RELIANCE",
  companyName: "Reliance Industries Ltd.",
  exchange: "NSE",
  ltp: 2948.55,
  change: 34.20,
  changePct: 1.17,
  open: 2915.00,
  high: 2962.80,
  low: 2910.00,
  prevClose: 2914.35,
  volume: "8.42M",
  marketCap: "₹19.97L Cr",
  pe: 28.4,
  eps: 103.82,
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart Data (legacy Recharts 1D candles — kept for backward compat)
// ─────────────────────────────────────────────────────────────────────────────

export const chartData1D: ChartDataPoint[] = [
  { time: "09:15", open: 2915.00, high: 2922.50, low: 2912.00, close: 2918.60, volume: 420000 },
  { time: "09:30", open: 2918.60, high: 2928.00, low: 2916.80, close: 2925.40, volume: 380000 },
  { time: "09:45", open: 2925.40, high: 2932.00, low: 2921.00, close: 2929.80, volume: 290000 },
  { time: "10:00", open: 2929.80, high: 2938.00, low: 2925.50, close: 2935.20, volume: 310000 },
  { time: "10:15", open: 2935.20, high: 2940.00, low: 2928.00, close: 2931.60, volume: 260000 },
  { time: "10:30", open: 2931.60, high: 2936.50, low: 2922.00, close: 2924.80, volume: 350000 },
  { time: "10:45", open: 2924.80, high: 2930.00, low: 2918.00, close: 2928.40, volume: 280000 },
  { time: "11:00", open: 2928.40, high: 2942.00, low: 2926.00, close: 2939.60, volume: 420000 },
  { time: "11:15", open: 2939.60, high: 2948.00, low: 2935.00, close: 2944.20, volume: 390000 },
  { time: "11:30", open: 2944.20, high: 2952.00, low: 2940.50, close: 2948.80, volume: 450000 },
  { time: "11:45", open: 2948.80, high: 2958.00, low: 2944.00, close: 2953.40, volume: 370000 },
  { time: "12:00", open: 2953.40, high: 2960.00, low: 2948.00, close: 2956.80, volume: 320000 },
  { time: "12:15", open: 2956.80, high: 2962.80, low: 2951.00, close: 2958.60, volume: 290000 },
  { time: "12:30", open: 2958.60, high: 2962.00, low: 2950.00, close: 2954.20, volume: 240000 },
  { time: "12:45", open: 2954.20, high: 2958.00, low: 2946.00, close: 2950.80, volume: 210000 },
  { time: "13:00", open: 2950.80, high: 2955.00, low: 2944.00, close: 2947.40, volume: 180000 },
  { time: "13:15", open: 2947.40, high: 2952.00, low: 2940.00, close: 2944.80, volume: 190000 },
  { time: "13:30", open: 2944.80, high: 2950.00, low: 2938.00, close: 2946.20, volume: 220000 },
  { time: "13:45", open: 2946.20, high: 2952.00, low: 2942.00, close: 2949.60, volume: 250000 },
  { time: "14:00", open: 2949.60, high: 2956.00, low: 2945.00, close: 2953.40, volume: 280000 },
  { time: "14:15", open: 2953.40, high: 2958.00, low: 2948.00, close: 2955.80, volume: 310000 },
  { time: "14:30", open: 2955.80, high: 2960.00, low: 2950.00, close: 2952.40, volume: 290000 },
  { time: "14:45", open: 2952.40, high: 2956.00, low: 2946.00, close: 2949.60, volume: 260000 },
  { time: "15:00", open: 2949.60, high: 2955.00, low: 2944.00, close: 2951.20, volume: 350000 },
  { time: "15:15", open: 2951.20, high: 2958.00, low: 2947.00, close: 2948.55, volume: 480000 },
]

// ─────────────────────────────────────────────────────────────────────────────
// OHLC History — lightweight-charts format (Unix timestamp seconds)
// One entry per stock, one per timeframe.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a plausible sequence of OHLC bars walking from `startPrice`.
 * `volatility` is the max % move per bar (0–1).
 */
function generateOHLC(
  startPrice: number,
  bars: number,
  intervalSeconds: number,
  endTimestamp: number, // end of last bar in Unix seconds
  volatility = 0.008,
): OHLCBar[] {
  const result: OHLCBar[] = []
  let price = startPrice
  const startTs = endTimestamp - bars * intervalSeconds

  for (let i = 0; i < bars; i++) {
    const t = startTs + i * intervalSeconds
    const move = (Math.random() - 0.49) * volatility * price
    const open = price
    const close = Math.max(1, price + move)
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
    const low  = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
    const volume = Math.floor(100000 + Math.random() * 500000)
    result.push({ time: t, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), volume })
    price = close
  }
  return result
}

// Use a fixed "now" so the seed is deterministic on first load
const BASE_TS = 1735200000 // 2024-12-26 12:00:00 UTC in seconds

/** Intraday (1D) bars — 1-minute resolution, 375 bars (6h 15m session) */
const INTRADAY_INTERVAL = 60
const INTRADAY_BARS = 375

/** 1W — 30-minute bars, 65 bars (5 trading days × 13 bars) */
const WEEK_INTERVAL = 30 * 60
const WEEK_BARS = 65

/** 1M — daily bars, 22 bars */
const MONTH_INTERVAL = 24 * 3600
const MONTH_BARS = 22

/** 3M — daily bars, 63 bars */
const THREEMONTH_BARS = 63

/** 1Y — weekly bars, 52 bars */
const YEAR_INTERVAL = 7 * 24 * 3600
const YEAR_BARS = 52

export type ChartTimeframe = "1D" | "1W" | "1M" | "3M" | "1Y"

export type StockOHLCHistory = Record<ChartTimeframe, OHLCBar[]>

function buildHistory(basePrice: number, volatility = 0.008): StockOHLCHistory {
  return {
    "1D": generateOHLC(basePrice * 0.988, INTRADAY_BARS, INTRADAY_INTERVAL, BASE_TS, volatility * 0.4),
    "1W": generateOHLC(basePrice * 0.975, WEEK_BARS,     WEEK_INTERVAL,     BASE_TS, volatility * 0.6),
    "1M": generateOHLC(basePrice * 0.945, MONTH_BARS,    MONTH_INTERVAL,    BASE_TS, volatility),
    "3M": generateOHLC(basePrice * 0.87,  THREEMONTH_BARS, MONTH_INTERVAL,  BASE_TS, volatility * 1.2),
    "1Y": generateOHLC(basePrice * 0.72,  YEAR_BARS,     YEAR_INTERVAL,     BASE_TS, volatility * 1.5),
  }
}

/**
 * Map of stockId → timeframe → OHLCBar[]
 * All generated once at module load so bars are stable across re-renders.
 */
export const stockOHLCHistory: Record<string, StockOHLCHistory> = {
  reliance:   buildHistory(2948.55, 0.007),
  tcs:        buildHistory(4218.90, 0.006),
  infy:       buildHistory(1876.30, 0.008),
  hdfcbank:   buildHistory(1724.60, 0.007),
  icicibank:  buildHistory(1342.75, 0.009),
  sbi:        buildHistory(838.45,  0.010),
  tatamotors: buildHistory(1024.80, 0.014),
  lt:         buildHistory(3752.25, 0.007),
  airtel:     buildHistory(1892.40, 0.008),
  itc:        buildHistory(486.70,  0.006),
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────────────────────────────────────

export const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "Arjun_Mehta",
    avatar: "AM",
    portfolioValue: 1842650,
    cashBalance: 158320,
    investedValue: 1684330,
    totalReturn: 342650,
    returnPct: 22.84,
    trades: 147,
    badge: "gold",
  },
  {
    rank: 2,
    username: "Priya_Sharma",
    avatar: "PS",
    portfolioValue: 1724380,
    cashBalance: 182450,
    investedValue: 1541930,
    totalReturn: 224380,
    returnPct: 14.96,
    trades: 132,
    badge: "silver",
  },
  {
    rank: 3,
    username: "Rahul_Iyer",
    avatar: "RI",
    portfolioValue: 1698120,
    cashBalance: 214600,
    investedValue: 1483520,
    totalReturn: 198120,
    returnPct: 13.21,
    trades: 118,
    badge: "bronze",
  },
  {
    rank: 4,
    username: "Neha_Kapoor",
    avatar: "NK",
    portfolioValue: 1634500,
    cashBalance: 267800,
    investedValue: 1366700,
    totalReturn: 134500,
    returnPct: 8.97,
    trades: 94,
  },
  {
    rank: 5,
    username: "Vikram_Das",
    avatar: "VD",
    portfolioValue: 1587240,
    cashBalance: 312500,
    investedValue: 1274740,
    totalReturn: 87240,
    returnPct: 5.82,
    trades: 78,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Activity Feed
// ─────────────────────────────────────────────────────────────────────────────

export const activityFeed: TradeActivity[] = [
  {
    id: "a1",
    user: "Rahul",
    action: "bought",
    quantity: 10,
    stock: "TCS",
    price: 4218.90,
    timestamp: "2 min ago",
  },
  {
    id: "a2",
    user: "Priya",
    action: "sold",
    quantity: 5,
    stock: "Reliance",
    price: 2948.55,
    timestamp: "5 min ago",
  },
  {
    id: "a3",
    user: "Arjun",
    action: "bought",
    quantity: 25,
    stock: "ICICI Bank",
    price: 1342.75,
    timestamp: "8 min ago",
    special: "Arjun entered Top 3 on Leaderboard",
  },
  {
    id: "a4",
    user: "Neha",
    action: "bought",
    quantity: 15,
    stock: "Infosys",
    price: 1876.30,
    timestamp: "12 min ago",
  },
  {
    id: "a5",
    user: "Vikram",
    action: "sold",
    quantity: 30,
    stock: "Tata Motors",
    price: 1024.80,
    timestamp: "18 min ago",
  },
  {
    id: "a6",
    user: "Ananya",
    action: "bought",
    quantity: 8,
    stock: "L&T",
    price: 3752.25,
    timestamp: "25 min ago",
  },
  {
    id: "a7",
    user: "Karan",
    action: "sold",
    quantity: 50,
    stock: "SBI",
    price: 838.45,
    timestamp: "31 min ago",
  },
  {
    id: "a8",
    user: "Meera",
    action: "bought",
    quantity: 20,
    stock: "Airtel",
    price: 1892.40,
    timestamp: "38 min ago",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Initial Portfolio Holdings (deterministic — no Math.random())
// ─────────────────────────────────────────────────────────────────────────────

function makeHolding(
  stock: Stock,
  quantity: number,
  avgBuyPrice: number
): PortfolioHolding {
  const currentValue = quantity * stock.ltp
  const investedValue = quantity * avgBuyPrice
  const pnl = currentValue - investedValue
  const pnlPct = (pnl / investedValue) * 100
  return {
    stockId: stock.id,
    symbol: stock.symbol,
    companyName: stock.companyName,
    quantity,
    avgBuyPrice,
    ltp: stock.ltp,
    currentValue,
    investedValue,
    pnl,
    pnlPct,
    isPositive: pnl >= 0,
  }
}

export const initialHoldings: PortfolioHolding[] = [
  makeHolding(watchlistStocks[0], 15, 2780.00),  // RELIANCE
  makeHolding(watchlistStocks[1], 8,  4380.50),  // TCS
  makeHolding(watchlistStocks[2], 20, 1720.00),  // INFY
  makeHolding(watchlistStocks[3], 12, 1850.00),  // HDFCBANK
  makeHolding(watchlistStocks[4], 30, 1180.00),  // ICICIBANK
  makeHolding(watchlistStocks[5], 50, 920.00),   // SBIN
  makeHolding(watchlistStocks[6], 10, 880.00),   // TATAMOTORS
  makeHolding(watchlistStocks[7], 5,  3480.00),  // LT
]

// ─────────────────────────────────────────────────────────────────────────────
// Initial Transaction History
// ─────────────────────────────────────────────────────────────────────────────

export const initialTransactions: Transaction[] = [
  {
    id: "t1",
    stockId: "reliance",
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    action: "buy",
    quantity: 15,
    price: 2780.00,
    orderType: "market",
    exchange: "NSE",
    timestamp: "2024-12-18T09:32:00Z",
    totalValue: 41700.00,
    status: "executed",
  },
  {
    id: "t2",
    stockId: "tcs",
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    action: "buy",
    quantity: 8,
    price: 4380.50,
    orderType: "limit",
    exchange: "NSE",
    timestamp: "2024-12-18T10:15:00Z",
    totalValue: 35044.00,
    status: "executed",
  },
  {
    id: "t3",
    stockId: "infy",
    symbol: "INFY",
    companyName: "Infosys",
    action: "buy",
    quantity: 20,
    price: 1720.00,
    orderType: "market",
    exchange: "NSE",
    timestamp: "2024-12-19T09:45:00Z",
    totalValue: 34400.00,
    status: "executed",
  },
  {
    id: "t4",
    stockId: "hdfcbank",
    symbol: "HDFCBANK",
    companyName: "HDFC Bank",
    action: "buy",
    quantity: 12,
    price: 1850.00,
    orderType: "market",
    exchange: "NSE",
    timestamp: "2024-12-20T11:00:00Z",
    totalValue: 22200.00,
    status: "executed",
  },
  {
    id: "t5",
    stockId: "icicibank",
    symbol: "ICICIBANK",
    companyName: "ICICI Bank",
    action: "sell",
    quantity: 10,
    price: 1320.00,
    orderType: "market",
    exchange: "NSE",
    timestamp: "2024-12-21T13:30:00Z",
    totalValue: 13200.00,
    status: "executed",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Starting virtual capital for every participant */
export const STARTING_CAPITAL = 1_500_000

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)}Cr`
    if (value >= 100_000)    return `₹${(value / 100_000).toFixed(2)}L`
    if (value >= 1_000)      return `₹${(value / 1_000).toFixed(2)}K`
    return `₹${value.toFixed(2)}`
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value)
}
