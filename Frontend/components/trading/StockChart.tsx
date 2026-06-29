"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import EChartsReact from "echarts-for-react"
import * as echarts from "echarts"
import { TrendingUp, TrendingDown, ArrowUpRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { watchlistStocks, stockOHLCHistory } from "@/lib/mock-data"
import type { ChartTimeframe, WatchlistStock } from "@/lib/mock-data"
import { useSelectedStockId, useStockPrice } from "@/store/useTradeStore"

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TIMEFRAMES: ChartTimeframe[] = ["1D", "1W", "1M", "3M", "1Y"]

// Dark theme colors matching the app's fintech design
const CHART_COLORS = {
  bg:          "#1a1a2e",
  grid:        "#2d2d44",
  text:        "#94a3b8",
  textDim:     "#64748b",
  gainColor:   "#22c55e",
  lossColor:   "#ef4444",
  gainFill:    "rgba(34, 197, 94, 0.1)",
  lossFill:    "rgba(239, 68, 68, 0.1)",
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      <span className="font-mono text-xs font-semibold text-foreground">{value}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface StockChartProps {
  /** Optional override — if omitted the component reads from the Zustand store */
  selectedStockId?: string
  watchlistStocks?: WatchlistStock[]
}

export function StockChart({ selectedStockId: propStockId, watchlistStocks: propStocks }: StockChartProps) {
  const storeStockId  = useSelectedStockId()
  const stockId       = propStockId ?? storeStockId

  // Live price from simulator
  const livePrice = useStockPrice(stockId)

  // Resolve static stock metadata for name / symbol display
  const stocks     = propStocks ?? watchlistStocks
  const stockMeta  = stocks.find((s) => s.id === stockId) ?? stocks[0]

  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1D")
  const [zoomLevel, setZoomLevel] = useState(1)
  const echartsRef = useRef<EChartsReact>(null)

  // ── Generate chart option ────────────────────────────────────────────────
  const getChartOption = useCallback(() => {
    const history = stockOHLCHistory[stockId]?.[timeframe]
    if (!history || history.length === 0) {
      return {}
    }

    // Transform to dates and candlestick data
    const dates = history.map((bar) => new Date(bar.time).toLocaleDateString("en-IN"))
    // ECharts candlestick format: [open, close, lowest, highest]
    const candleData = history.map((bar) => [bar.open, bar.close, bar.low, bar.high])
    
    // Pre-compute colors for each candle
    const candleColors = candleData.map((d) => (d[1] >= d[0] ? CHART_COLORS.gainColor : CHART_COLORS.lossColor))

    return {
      backgroundColor: CHART_COLORS.bg,
      textStyle: {
        color: CHART_COLORS.text,
      },
      grid: {
        left: 40,
        right: 20,
        bottom: 30,
        top: 10,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
          },
        },
        axisLabel: {
          color: CHART_COLORS.textDim,
          fontSize: 10,
        },
        splitLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
            type: "dashed",
          },
        },
      },
      yAxis: {
        type: "value",
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
          },
        },
        axisLabel: {
          color: CHART_COLORS.textDim,
          fontSize: 10,
          formatter: (value: any) => {
            if (typeof value === "number" && Number.isFinite(value)) {
              return "₹" + value.toFixed(0)
            }
            return ""
          },
        },
        splitLine: {
          lineStyle: {
            color: CHART_COLORS.grid,
          },
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: CHART_COLORS.grid,
        borderColor: CHART_COLORS.text,
        textStyle: {
          color: CHART_COLORS.text,
        },
        axisPointer: {
          lineStyle: {
            color: CHART_COLORS.text,
            type: "dashed",
          },
        },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return ""
          const dataIndex = params[0].dataIndex
          if (dataIndex >= 0 && dataIndex < candleData.length) {
            const d = candleData[dataIndex]
            if (!d || d.length < 4 || !Number.isFinite(d[0]) || !Number.isFinite(d[1]) || !Number.isFinite(d[2]) || !Number.isFinite(d[3])) {
              return ""
            }
            const isGain = d[1] >= d[0]
            return `
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
                <div style="color: ${CHART_COLORS.text}; margin-bottom: 4px;">${dates[dataIndex]}</div>
                <div style="color: ${CHART_COLORS.textDim};">O: ₹${d[0].toFixed(2)}</div>
                <div style="color: ${CHART_COLORS.textDim};">H: ₹${d[3].toFixed(2)}</div>
                <div style="color: ${CHART_COLORS.textDim};">L: ₹${d[2].toFixed(2)}</div>
                <div style="color: ${isGain ? CHART_COLORS.gainColor : CHART_COLORS.lossColor}; font-weight: bold;">C: ₹${d[1].toFixed(2)}</div>
              </div>
            `
          }
          return ""
        },
      },
      series: [
        {
          name: stockMeta.symbol,
          type: "line",
          data: candleData.map((d, i) => ({
            value: d[1],
            itemStyle: {
              color: candleColors[i],
            }
          })),
          smooth: false,
          showSymbol: true,
          symbolSize: 5,
          lineStyle: {
            width: 2.5,
            color: CHART_COLORS.gainColor,
          },
          areaStyle: {
            color: CHART_COLORS.gainFill,
          },
        },
      ],
      animationDuration: 300,
      animationEasing: "cubicOut",
    }
  }, [stockId, timeframe])

  // ── Zoom handlers ──────────────────────────────────────────────────────
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.2, 3)
    setZoomLevel(newZoom)
    const chartInstance = echartsRef.current?.getEchartsInstance?.()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: "takeGlobalCursor",
      })
    }
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.2, 1)
    setZoomLevel(newZoom)
    const chartInstance = echartsRef.current?.getEchartsInstance?.()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: "takeGlobalCursor",
      })
    }
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    const chartInstance = echartsRef.current?.getEchartsInstance?.()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: "takeGlobalCursor",
      })
    }
  }

  // ── Update chart when data changes ───────────────────────────────────────
  useEffect(() => {
    const chartInstance = echartsRef.current?.getEchartsInstance?.()
    if (chartInstance) {
      const option = getChartOption()
      chartInstance.setOption(option, true)
    }
  }, [getChartOption])

  // ── Apply zoom with dataZoom ────────────────────────────────────────────
  useEffect(() => {
    const chartInstance = echartsRef.current?.getEchartsInstance?.()
    if (chartInstance && zoomLevel !== 1) {
      const dataZoomEnd = Math.max(5, Math.min(100, 100 / zoomLevel))
      chartInstance.setOption({
        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: Math.ceil(375 * (zoomLevel - 1) / 2),
            filterMode: "weakFilter",
          },
        ],
      }, false)
    }
  }, [zoomLevel])

  // ── Derived display values ──────────────────────────────────��────────────
  const ltp        = livePrice?.ltp       ?? stockMeta.ltp
  const change     = livePrice?.change    ?? stockMeta.change
  const changePct  = livePrice?.changePct ?? stockMeta.changePct
  const high       = livePrice?.high      ?? stockMeta.high
  const low        = livePrice?.low       ?? stockMeta.low
  const isPositive = livePrice?.isPositive ?? stockMeta.isPositive
  const volume     = livePrice
    ? (livePrice.volume / 1_000_000).toFixed(2) + "M"
    : stockMeta.volume

  return (
    <div className="surface-card rounded-xl flex flex-col h-full overflow-hidden">
      {/* ── Stock header ── */}
      <div className="px-5 pt-4 pb-3 border-b border-border/50">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          {/* Name + price */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-foreground">{stockMeta.companyName}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary border border-border/50 text-muted-foreground">
                NSE: {stockMeta.symbol}
              </span>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono font-bold text-3xl text-foreground tracking-tight">
                ₹{ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-sm font-semibold font-mono",
                  isPositive ? "bg-fin-gain/15 text-fin-gain" : "bg-fin-loss/15 text-fin-loss"
                )}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({isPositive ? "+" : ""}{changePct.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <StatBadge label="Open"  value={`₹${stockMeta.open.toFixed(2)}`} />
            <StatBadge label="High"  value={`₹${high.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
            <StatBadge label="Low"   value={`₹${low.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
            <StatBadge label="Prev Close" value={`₹${stockMeta.prevClose?.toFixed(2) ?? "—"}`} />
            <StatBadge label="Volume" value={volume} />
          </div>
        </div>
      </div>

      {/* ── Timeframe selector & Zoom controls ── */}
      <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border/40">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150",
              timeframe === tf
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            {tf}
          </button>
        ))}

        {/* Zoom controls */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-muted-foreground px-2">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetZoom}
            disabled={zoomLevel === 1}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-border/40 mx-1" />

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-fin-gain inline-block" />
              Bullish
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-fin-loss inline-block" />
              Bearish
            </span>
          </div>
        </div>
      </div>

      {/* ── Chart canvas ── */}
      <div className="flex-1 min-h-0 w-full">
        <EChartsReact
          ref={echartsRef}
          option={getChartOption()}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "canvas", useDirtyRect: true }}
          notMerge={false}
          lazyUpdate={false}
        />
      </div>
    </div>
  )
}
