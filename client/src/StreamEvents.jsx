import React, { useState, useRef } from "react";
import SendMessageForm from "./SendMessageForm";
import Message from "./Message";
import { decodeString } from "./b64Utils";
import Axios from "axios";

const StreamEvents = (props) => {
  const [token, setToken] = useState("");
  const [eventSource, setEventSource] = useState();
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState(["enter a nickname & connect"]);
  const [ctr, setCtr] = useState(0);
  const bottomRef = useRef();

  const renderMessage = ({ index, date, message, token }) => (
    <Message key={index} u={token} ts={date} message={message} />
  );

  const updateDisplay = (msgs) => {
    setCtr(ctr + 1);
    setData(
      msgs.map((strItem, index) =>
        renderMessage({ index, ...JSON.parse(decodeString(strItem)) })
      )
    );
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const updateToken = (e) => {
    e.preventDefault();
    setToken(e.target.value); // update value of token
  };

  const parseServerCode = (code) => {
    switch (code) {
      case "1":
        console.log("heart-beat.");
        break;
      case "2":
        console.log("acknowledge.");
        Axios.get(
          `${process.env.REACT_APP_API}/stream/update/${token}/${Date.now()}`
        );
        break;
      default:
        console.log("??? unknown");
    }
  };

  const startStopEvents = (b) => {
    if (b) {
      if (eventSource) {
        eventSource.close(); // if already open, close handle
      }
      // console.log("start events");
      const es = new EventSource(
        `${process.env.REACT_APP_API}/stream/listen/${token}/${Date.now()}`
      ); // open stream
      es.onmessage = (e) => {
        if (e.data.length > 5) {
          // console.log("message received");
          updateDisplay(JSON.parse(e.data)); // process events
        } else {
          parseServerCode(e.data);
        }
      };
      setEventSource(es); // store handle
      setToggle(true);
    } else {
      // console.log("stop events");
      if (eventSource) {
        eventSource.close(); // close stream
      }
      setEventSource(undefined); // remove handle
      setToggle(false);
      setCtr(0);
    }
  };

  return (
    <div className="chat-div-window" {...props}>
      <div className="chat-div-title">{props.title}</div>
      <div className="chat-div-login">
        <input
          className="chat-input-name"
          placeholder="nickname"
          value={token}
          onChange={updateToken}
          disabled={toggle}
        />
        <button
          className={!toggle ? "chat-btn-connect" : "chat-btn-disconnect"}
          onClick={() => startStopEvents(!toggle)}
          disabled={token.length < 3}
        >
          {!toggle ? "connect" : "disconnect"}
        </button>
      </div>
      <div className="chat-div-messages">
        <div>
          {data}
          <div ref={bottomRef} />
        </div>
      </div>
      <SendMessageForm token={token} isConnected={toggle && ctr > 0} />
    </div>
  );
};

export default StreamEvents;
