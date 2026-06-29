const express = require("express");
const http = require("http");
const cors = require("cors");

const setupWebSocket = require("./websocket");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Mock Trading WebSocket Server Running");
});

const server = http.createServer(app);

setupWebSocket(server);

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
