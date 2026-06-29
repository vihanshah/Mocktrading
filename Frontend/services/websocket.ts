import { useTradeStore } from "@/store/useTradeStore";

let socket: WebSocket | null = null;

export function connectWebSocket() {
  const socket = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000",
  );

  socket.onopen = () => {
    console.log("✅ Connected to WebSocket");
  };

  let lastUpdate = 0;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "PRICE_UPDATE") {
      const now = Date.now();

      // Update UI only every 500ms
      const store = useTradeStore.getState();

      const renderDelay =
        store.simulationSpeed === 1
          ? 1000
          : store.simulationSpeed === 2
            ? 500
            : 200;

      if (now - lastUpdate < renderDelay) return;

      lastUpdate = now;

      if (store.marketRunning) {
        store.updateMarketData(data.prices, data.indices);
      }
    }
  };
  socket.onclose = () => {
    console.log("❌ WebSocket Closed");
  };

  socket.onerror = (err) => {
    console.error("WebSocket Error:", err);
  };
}
