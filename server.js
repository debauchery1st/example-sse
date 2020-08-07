const express = require("express");
const cors = require("cors");
const server = express();
// require middleware
const PORT = process.env.PORT || 5000;

server.use(express.json());

// server.use middleware
server.use(cors());
// server side events
server.use("/stream", require("./sseRouter"));

// perimeter
server.get("/api", (req, res) => {
  res.status(200).send("🥧");
});

// root
server.get("/", (req, res) => {
  res.status(200).send("hello world");
});

server.listen(PORT, () => console.log(`server listening at ${PORT}`));
