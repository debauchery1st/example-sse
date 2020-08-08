// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte
function toBinary(string) {
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function fromBinary(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

// atob & btoa require a browser.

export function encodeString(s) {
  // return btoa(toBinary(s));
  const b = new Buffer.from(toBinary(s));
  return b.toString("base64");
}

export function decodeString(encoded) {
  // return fromBinary(atob(encoded));
  const b = new Buffer.from(encoded, "base64");
  return fromBinary(b.toString());
}
