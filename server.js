const express = require("express");
const cors = require("cors");
const server = express();
// require middleware
const port = process.env.PORT;

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

server.listen(port || 5000, () =>
  console.log(`server listening at ${port || 5000}`)
);
