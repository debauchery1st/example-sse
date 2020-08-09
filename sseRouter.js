const express = require("express");
const localCache = require("./localCache");
const { encodeString, decodeString } = require("./b64Utils");

localCache.startCache(); // start the instance.
localCache.setCacheLimit(20);
localCache.pushMessage({
  msg: encodeString(JSON.stringify({ date: Date.now(), message: "Welcome." })),
  token: "system"
});

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
    const message = decodeString(req.body.data);
    if (message.startsWith("/")) {
      localCache.processChatSlash({ message, t });
    } else {
      // store as encoded object.
      localCache.pushMessage({
        msg: encodeString(
          JSON.stringify({
            date: Date.now(),
            message,
            token: t
          })
        ),
        token: t
      });
    }
    res.status(200).send("ok");
  }
});

function registerToken(token, value) {
  // TODO : fix response
  if (localCache.getToken(token)) {
    const message = `${token} already registered.`;
    const output = `data: ${encodeString(
      JSON.stringify({ date: Date.now(), message })
    )}`; // personally message the client by not pushing it to the stack.
    console.log(output);
    return output;
  }
  localCache.setToken(token, value);
  return token;
}

router.get("/update/:token/:timestamp", (req, res) => {
  const t = req.params.token;
  const ts = req.params.timestamp;
  console.log(`refreshing ${t} ${ts}`);
  const lts = localCache.startCache().tokens[t];
  if (!lts) {
    console.log("not found");
    res.status(304);
    return;
  }
  localCache.startCache().tokens[t].ts = Date.now();
  res.status(200);
});

router.get("/listen/:token/:timestamp", (req, res) => {
  const t = req.params.token;
  const ts = req.params.timestamp;
  if (!t) {
    res.status(200).send("no token!");
  } else {
    const token = registerToken(t, {
      ts,
      last: 0,
      pulse: 1,
      interval: undefined
    }); // register the token
    if (t !== token) {
      // res.write(token);
      // res.write(`data: ${3}\n\n`); // write new message

      console.log(`imposter? ${t}`);
      return;
    }
    res.set(sseHeaders); // set headers to stream

    localCache.startCache().tokens[t].interval = setInterval(() => {
      const i = localCache.startCache(); // brevity
      i.tokens[t].pulse = (i.tokens[t].pulse + 1) % 20;
      const timeDelta = Date.now() - i.tokens[t].ts;

      const lastMessage = JSON.parse(decodeString(localCache.getMessages(1)));
      if (lastMessage.date !== i.tokens[t].last) {
        i.tokens[t].last = lastMessage.date;
        res.write(`data: ${JSON.stringify(getMessages())}\n\n`); // write new message
      } else {
        if (i.tokens[t].pulse === 0) {
          // console.log(timeDelta);
          if (timeDelta > 60000) {
            if (timeDelta > 120000) {
              // clear timer
              console.log(`release ${t}`);
              clearInterval(i.tokens[t].interval);
              delete i.tokens[t];
            } else {
              // acknowledge
              res.write(`data: ${2}\n\n`);
            }
          } else {
            // heartbeat
            res.write(`data: ${1}\n\n`);
          }
        }
      }
    }, 1000); // cycle every second until client closes the connection.
  }
});

module.exports = router;
