import React, { useState } from "react";
import axios from "axios";
const SendMessage = (props) => {
  const [message, setMessage] = useState("");
  const connected = props.isConnected;
  const token = props.token;
  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/stream/post/${token}`,
        { data: message }
      )
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
  return (
    <form onSubmit={sendMessage}>
      <input
        placeholder="send a message"
        value={message}
        onChange={handleUpdate}
        style={{
          minWidth: "10ch",
          maxWidth: "75ch",
          padding: "1ch",
          margin: "1ch"
        }}
      />
      <button disabled={!connected}>send</button>
    </form>
  );
};

export default SendMessage;
