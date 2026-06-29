"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  TrendingDown,
  ChevronDown,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { watchlistStocks } from "@/lib/mock-data";
import type { WatchlistStock } from "@/lib/mock-data";
import { useCashBalance, usePlaceTrade } from "@/store/useTradeStore";
import { useTradeStore } from "@/store/useTradeStore";

type OrderType = "market" | "limit";
type Exchange = "NSE" | "BSE";
type Action = "buy" | "sell";

interface TradingWidgetProps {
  selectedStockId?: string;
  watchlistStocksData?: WatchlistStock[];
}

export function TradingWidget({
  selectedStockId,
  watchlistStocksData,
}: TradingWidgetProps) {
  const stocks = watchlistStocksData ?? watchlistStocks;
  const cashBalance = useCashBalance();
  const placeTrade = usePlaceTrade();
  const stockPrices = useTradeStore((s) => s.stockPrices);

  const [tradeMessage, setTradeMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const [exchange, setExchange] = useState<Exchange>("NSE");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [action, setAction] = useState<Action>("buy");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState(
    stocks.find((s) => s.id === selectedStockId)?.symbol ?? stocks[0].symbol,
  );

  // Sync to selected stock from watchlist
  const currentStock =
    stocks.find((s) => s.symbol === selectedSymbol) ?? stocks[0];
  const marketPrice = stockPrices[currentStock.id]?.ltp ?? currentStock.ltp;
  console.log("LIVE PRICE", currentStock.id, stockPrices[currentStock.id]?.ltp);
  const effectivePrice =
    orderType === "limit" && limitPrice ? parseFloat(limitPrice) : marketPrice;
  const estimatedValue = quantity * effectivePrice;
  const margin = estimatedValue * 0.2; // 20% margin requirement (mock)

  function adjustQty(delta: number) {
    setQuantity((q) => Math.max(1, q + delta));
  }

  function handleSubmit() {
    const result = placeTrade({
      stockId: currentStock.id,
      action,
      quantity,
      price: effectivePrice,
      orderType,
      exchange,
    });
    setTradeMessage({
      ok: result.ok,
      text: result.ok
        ? `${action === "buy" ? "Bought" : "Sold"} ${quantity} × ${currentStock.symbol} @ ₹${effectivePrice.toFixed(2)}`
        : (result.reason ?? "Trade failed."),
    });
    setTimeout(() => setTradeMessage(null), 3500);
  }

  return (
    <div className="surface-card rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50">
        <h3 className="font-display font-semibold text-sm text-foreground">
          Quick Trade
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Simulated order entry
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-3 flex flex-col gap-4">
        {/* Buy / Sell toggle */}
        <div className="flex rounded-xl overflow-hidden border border-border/60 bg-secondary/40 p-0.5 gap-0.5">
          <button
            onClick={() => setAction("buy")}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5",
              action === "buy"
                ? "bg-fin-gain text-background shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Buy
          </button>
          <button
            onClick={() => setAction("sell")}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5",
              action === "sell"
                ? "bg-fin-loss text-foreground shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Sell
          </button>
        </div>

        {/* Exchange toggle */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Exchange
          </label>
          <div className="flex rounded-lg overflow-hidden border border-border/50 bg-secondary/30 p-0.5 gap-0.5">
            {(["NSE", "BSE"] as Exchange[]).map((ex) => (
              <button
                key={ex}
                onClick={() => setExchange(ex)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-150",
                  exchange === ex
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Stock selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Stock
          </label>
          <div className="relative">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full appearance-none bg-secondary/60 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 cursor-pointer pr-8"
            >
              {stocks.map((s) => (
                <option key={s.id} value={s.symbol} className="bg-card">
                  {s.symbol} — {s.companyName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Current price indicator */}
          <div className="flex items-center justify-between mt-1.5 px-0.5">
            <span className="text-[10px] text-muted-foreground">
              Market Price
            </span>
            <span
              className={cn(
                "text-xs font-mono font-semibold",
                currentStock.isPositive ? "text-fin-gain" : "text-fin-loss",
              )}
            >
              ₹
              {marketPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Order type */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Order Type
          </label>
          <div className="flex rounded-lg overflow-hidden border border-border/50 bg-secondary/30 p-0.5 gap-0.5">
            {(["market", "limit"] as OrderType[]).map((ot) => (
              <button
                key={ot}
                onClick={() => setOrderType(ot)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 capitalize",
                  orderType === ot
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {ot}
              </button>
            ))}
          </div>
        </div>

        {/* Limit price (conditional) */}
        {orderType === "limit" && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Limit Price (₹)
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={marketPrice.toFixed(2)}
              className="w-full bg-secondary/60 border border-border/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Quantity (Shares)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustQty(-1)}
              className="w-9 h-9 rounded-lg bg-secondary/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="flex-1 bg-secondary/60 border border-border/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground text-center focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={() => adjustQty(1)}
              className="w-9 h-9 rounded-lg bg-secondary/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-xl bg-secondary/40 border border-border/50 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Est. Order Value</span>
            <span className="font-mono font-bold text-foreground">
              ₹
              {estimatedValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Margin Required</span>
              <Info className="w-3 h-3" />
            </div>
            <span className="font-mono text-muted-foreground">
              ₹{margin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-px bg-border/40" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Available Cash</span>
            <span
              className={cn(
                "font-mono",
                cashBalance >= estimatedValue
                  ? "text-fin-gain"
                  : "text-fin-loss",
              )}
            >
              ₹
              {cashBalance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 pt-2 border-t border-border/40 flex flex-col gap-2">
        {tradeMessage && (
          <div
            className={cn(
              "text-xs rounded-lg px-3 py-2 font-medium text-center",
              tradeMessage.ok
                ? "bg-fin-gain/10 text-fin-gain border border-fin-gain/25"
                : "bg-fin-loss/10 text-fin-loss border border-fin-loss/25",
            )}
          >
            {tradeMessage.text}
          </div>
        )}
        <button
          onClick={handleSubmit}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold transition-all duration-150 shadow-lg active:scale-[0.98]",
            action === "buy"
              ? "bg-fin-gain text-background hover:opacity-90 shadow-fin-gain/20"
              : "bg-fin-loss text-foreground hover:opacity-90 shadow-fin-loss/20",
          )}
        >
          {action === "buy" ? "Place Buy Order" : "Place Sell Order"}
          <span className="ml-2 opacity-70 text-xs font-mono">
            {quantity} × ₹{effectivePrice.toFixed(2)}
          </span>
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          Simulated trades only. No real money involved.
        </p>
      </div>
    </div>
  );
}
