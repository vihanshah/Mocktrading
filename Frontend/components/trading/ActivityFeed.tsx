"use client";

import { Zap, TrendingUp, TrendingDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { activityFeed } from "@/lib/mock-data";
import type { TradeActivity } from "@/lib/mock-data";
import { useTransactions } from "@/store/useTradeStore";

function ActivityItem({ activity }: { activity: TradeActivity }) {
  const isBuy = activity.action === "bought";

  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-fin-surface-hover transition-colors">
      {/* Icon */}
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          isBuy
            ? "bg-fin-gain/15 text-fin-gain"
            : "bg-fin-loss/15 text-fin-loss",
        )}
      >
        {isBuy ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activity.special ? (
          <p className="text-xs text-foreground leading-relaxed">
            <span className="flex items-center gap-1 mb-0.5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-yellow-400">
                {activity.special}
              </span>
            </span>
          </p>
        ) : null}
        <p className="text-xs text-foreground leading-relaxed">
          <span className="font-semibold text-foreground">{activity.user}</span>
          <span className="text-muted-foreground"> {activity.action} </span>
          <span className="font-semibold font-mono">{activity.quantity}</span>
          <span className="text-muted-foreground"> shares of </span>
          <span
            className={cn(
              "font-semibold",
              isBuy ? "text-fin-gain" : "text-fin-loss",
            )}
          >
            {activity.stock}
          </span>
          <span className="text-muted-foreground"> @ </span>
          <span className="font-mono text-xs text-foreground">
            ₹
            {activity.price.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </span>
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {activity.timestamp}
        </p>
      </div>

      {/* Value */}
      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-xs font-mono font-semibold",
            isBuy ? "text-fin-gain" : "text-fin-loss",
          )}
        >
          {isBuy ? "+" : "-"}₹
          {(activity.quantity * activity.price).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const transactions = useTransactions();
  return (
    <div className="surface-card rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Live Activity
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Recent trades across all participants
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
          <span className="text-[10px] font-semibold text-primary">
            Streaming
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-0.5 p-2 overflow-y-auto scrollbar-none max-h-72">
        {transactions.map((tx) => (
          <ActivityItem
            key={tx.id}
            activity={{
              id: tx.id,
              user: "Arjun",
              action: tx.action === "buy" ? "bought" : "sold",
              quantity: tx.quantity,
              stock: tx.symbol,
              price: tx.price,
              timestamp: "Just now",
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-border/40">
        <p className="text-[10px] text-muted-foreground text-center">
          Activity feed will stream via WebSocket in production
        </p>
      </div>
    </div>
  );
}
