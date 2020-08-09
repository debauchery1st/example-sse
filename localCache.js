const localCache = (function () {
  let instance;
  /**
   * start the cache.
   *
   * optionally,
   *
   * you may provide
   * @param {Number} limit max number of messages in cache.
   * @param {String} status a friendly message regarding the state.
   * @param {Array} cache initial value ["hello world"]
   */
  function startCache() {
    // console.log(`limit ${limit}`);
    if (!instance) {
      // create the instance if it doesn't already exist.
      instance = new Object({
        cache: [],
        limit: 50,
        status: "OK",
        tokens: {},
        rooms: {
          general: {
            topic: "Welcome to my experimental chat server.",
            cache: []
          }
        }
      });
    }
    return instance;
  }

  function createRoom({ roomName, topic }) {
    if (roomName && !instance.rooms[roomName]) {
      instance.rooms[roomName] = {
        topic: topic || `Welcome to ${roomName}`,
        cache: []
      };
      return true;
    }
    return false;
  }

  function joinRoom({ roomName, token }) {
    if (instance.tokens[token] && instance.rooms[roomName]) {
      instance.tokens[token]["room"] = roomName;
      return true;
    }
    return false;
  }

  /**
   * returns the last n number of messages.
   * @param {Number} n default is 5
   */
  function getMessages(n) {
    const i = startCache();
    if (!n || i.cache.length < 1 || n > i.cache.length) {
      return i.cache;
    }
    // console.log(i);
    const idx = i.cache.length - 1;
    return i.cache[idx];
  }
  /**
   * store msg in cache
   * @param {String} msg
   */
  function pushMessage(msg) {
    const i = startCache();
    i.cache.push(msg);
    if (i.cache.length > i.limit) {
      i.cache.shift();
    }
  }
  function setCacheLimit(n) {
    if (n && n > 0) {
      instance.limit = n;
    }
  }
  function getCacheLimit() {
    return instance.limit;
  }
  /**
   * return value of token from instance.tokens
   * @param {String} token
   */
  function getToken(token) {
    const i = startCache();

    return i.tokens[token] || undefined;
  }
  /**
   * set value of token within instance.tokens.
   * @param {String} token
   * @param {any} value
   */
  function setToken(token, value) {
    instance.tokens[token] = value;
  }
  function processChatSlash({ message, t }) {
    const token = t;
    // message starts with a /
    const [cmd, ...roomName] = message.slice(1).split(" ");
    switch (cmd) {
      case "join":
        joinRoom({ roomName, token });
        break;
      case "create":
        createRoom({ roomName }) && joinRoom({ roomName, token });
        break;
      case "list":
        console.log(instance.rooms);
        break;
      default:
        console.log("unknown: ", message);
    }
  }
  return {
    startCache,
    getMessages,
    pushMessage,
    setCacheLimit,
    getCacheLimit,
    getToken,
    setToken,
    createRoom,
    joinRoom,
    processChatSlash
  };
})();

module.exports = localCache;
