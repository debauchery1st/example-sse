const localCache = (function () {
  let instance;
  /**
   * initialize the cache (internal)
   */
  // function createInstance({ limit, status, cache }) {
  //   return new Object({ limit, status, cache });
  // }
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
        tokens: {}
      });
    }
    return instance;
  }
  /**
   * returns the last n number of messages.
   * @param {Number} n default is 5
   */
  function getMessages(n) {
    const i = startCache();
    if (!n || i.cache.length < 5 || n > i.cache.length) {
      return i.cache;
    }
    return i.split(n || 5);
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
  return {
    startCache,
    getMessages,
    pushMessage,
    setCacheLimit,
    getCacheLimit,
    getToken,
    setToken
  };
})();

module.exports = localCache;
