import { supabase } from "./supabase";
import { USER_ID } from "./user";

export async function loadPortfolio() {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("user_id", USER_ID);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((row) => {
    const ltp = 0;

    return {
      stockId: row.symbol.toLowerCase(),
      symbol: row.symbol,
      companyName: row.symbol,

      quantity: row.quantity,

      avgBuyPrice: row.avg_buy_price,

      ltp,

      investedValue: row.quantity * row.avg_buy_price,

      currentValue: row.quantity * ltp,

      pnl: 0,

      pnlPct: 0,

      isPositive: true,
    };
  });
}
