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
    if (!instance) {
      // create the instance if it doesn't already exist.
      instance = new Object({
        limit: 50,
        status: "OK",
        tokens: { system: { room: "general" } },
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

  function getCache({ token }) {
    const general = startCache().rooms.general.cache;
    const u = startCache().tokens[token];
    let cache;
    try {
      cache = startCache().tokens[u.room].cache;
      console.log("u.room,", u.room);
    } catch {
      cache = general;
    }
    return cache;
  }

  /**
   * returns the last n number of messages.
   * @param {Number} n default is 5
   */
  function getMessages({ n, token }) {
    const cache = getCache({ token });
    if (!n || cache.length < 1 || n > cache.length) {
      return cache;
    }
    // console.log(i);
    const idx = cache.length - 1;
    return cache[idx];
  }
  /**
   * store msg in cache
   * @param {String} msg
   */
  function pushMessage({ msg, token }) {
    const i = startCache();
    const cache = getCache({ token });
    cache.push(msg);
    if (cache.length > i.limit) {
      cache.shift();
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
      case "info":
        const myInfo = instance.tokens[token];
        console.log(`name: ${token} room: ${myInfo.room}`);
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
