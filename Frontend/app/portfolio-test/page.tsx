"use client";

import { useState } from "react";
import { loadPortfolio } from "../../lib/loadPortfolio";

export default function PortfolioTest() {
  const [data, setData] = useState<any>([]);

  const fetchPortfolio = async () => {
    const result = await loadPortfolio();
    console.log(result);
    setData(result);
  };

  return (
    <div>
      <button onClick={fetchPortfolio}>Load Portfolio</button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
