const WebSocket = require("ws");
const { updatePrices } = require("./marketEngine");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("✅ Client Connected");

    ws.on("close", () => {
      console.log("❌ Client Disconnected");
    });
  });

  setInterval(() => {
    const prices = updatePrices();
    const market = updatePrices();

    const payload = {
      type: "PRICE_UPDATE",
      prices: market.stocks,
      indices: market.indices,
      timestamp: Date.now(),
    };
    console.log(payload);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  }, 100);

  return wss;
}

module.exports = setupWebSocket;
