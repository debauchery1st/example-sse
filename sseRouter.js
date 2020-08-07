const express = require("express");

const localCache = require("./localCache");
localCache.startCache(); // start the instance.
localCache.setCacheLimit(20);
localCache.pushMessage(
  JSON.stringify({ date: Date.now(), message: "Welcome." })
);
router = express.Router();

sseHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "Access-Control-Allow-Origin": "*", // allow cors during development. shouldn't be necessary in production
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept"
};

function getMessages() {
  return localCache.getMessages(100);
}

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

router.post("/post/:token", (req, res) => {
  const t = req.params.token;
  // console.log("post", t, req.body.data);
  if (!t) {
    res.status(200).send("no token!");
  } else {
    // const msgTime = Date.now();
    const m = JSON.stringify({
      date: Date.now(),
      message: req.body.data,
      token: t
    });
    // const msg = `\n[${Date.now()}]  ${req.body.data}`;
    localCache.pushMessage(m); // add the message to the local cache (globally shared)
    res.status(200).send("ok");
  }
});

function registerToken(token, value) {
  // TODO
  // if (localCache.getToken(token)) {
  //   console.log("token already registered.");
  //   localCache.setToken(token, value);
  //   return token;
  // }
  localCache.setToken(token, value);
  return token;
}

router.get("/listen/:token", (req, res) => {
  const t = req.params.token;
  if (!t) {
    res.status(200).send("no token!");
  } else {
    registerToken(t); // register the token
    const seconds = 1000;
    const n = 1;
    res.set(sseHeaders); // set headers to stream
    setInterval(() => {
      // const msgs = localCache.getMessages();
      // const lastChecked = localCache.getToken(t);
      // const lastMessage = msgs[msgs.length - 1];
      // if (lastMessage !== lastChecked) {
      //   localCache.setToken(t, lastMessage); // make them equal
      res.write(`data: ${JSON.stringify(getMessages())}\n\n`); // send to client.
      // }
    }, n * seconds); // cycle every n seconds until client closes the connection.
  }
});

module.exports = router;
