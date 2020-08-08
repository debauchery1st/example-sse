import React, { useState } from "react";
import { encodeString } from "./b64Utils";
import axios from "axios";
const SendMessageForm = (props) => {
  const [message, setMessage] = useState("");
  const connected = props.isConnected;
  const token = props.token;
  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API}/stream/post/${token}`, {
        data: encodeString(message)
      })
      .then((res) => {
        if (res.data === "ok") {
          setMessage("");
        }
      });
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  const invalidToken = token.length < 3;
  return (
    <form className="chat-form" onSubmit={sendMessage}>
      <input
        className="chat-form-input"
        placeholder="send a message"
        value={message}
        onChange={handleUpdate}
      />
      <button className="chat-form-btn" disabled={!connected || invalidToken}>
        send
      </button>
    </form>
  );
};

export default SendMessageForm;
