const express = require("express");
const localCache = require("./localCache");
const { encodeString, decodeString } = require("./b64Utils");

localCache.startCache(); // start the instance.
localCache.setCacheLimit(20);
localCache.pushMessage(
  encodeString(JSON.stringify({ date: Date.now(), message: "Welcome." }))
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
  if (!t) {
    res.status(200).send("no token!");
  } else {
    // store as encoded object.
    localCache.pushMessage(
      encodeString(
        JSON.stringify({
          date: Date.now(),
          message: decodeString(req.body.data),
          token: t
        })
      )
    );
    res.status(200).send("ok");
  }
});

function registerToken(token, value) {
  // TODO
  if (localCache.getToken(token)) {
    const message = `${token} already registered.`;
    const output = encodeString(JSON.stringify({ date: Date.now(), message }));
    return `data: ${output}`; // personally message the client by not pushing it to the stack.
    //  encodeString(JSON.stringify({ date: Date.now(), message: "Welcome." }))
    //        res.write(`data: ${JSON.stringify(getMessages())}\n\n`);
    // localCache.setToken(token, value);
    // return token;
  }
  localCache.setToken(token, value);
  return token;
}

router.get("/listen/:token/:timestamp", (req, res) => {
  const t = req.params.token;
  const ts = req.params.timestamp;
  if (!t) {
    res.status(200).send("no token!");
  } else {
    const token = registerToken(t, { ts, last: 0 }); // register the token
    if (t !== token) {
      res.write(token);
      return;
    }
    const seconds = 1000;
    const n = 1;
    res.set(sseHeaders); // set headers to stream
    setInterval(() => {
      const i = localCache.startCache();
      const lastMessage = JSON.parse(decodeString(localCache.getMessages(1)));
      if (lastMessage.date !== i.tokens[t].last) {
        i.tokens[t].last = lastMessage.date;
        res.write(`data: ${JSON.stringify(getMessages())}\n\n`);
      }
    }, n * seconds); // cycle every n seconds until client closes the connection.
  }
});

module.exports = router;
