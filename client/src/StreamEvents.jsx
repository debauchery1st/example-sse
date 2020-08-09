import React, { useState, useRef } from "react";
import SendMessageForm from "./SendMessageForm";
import Message from "./Message";
import LoginModal from "./LoginModal";
import { decodeString } from "./b64Utils";
import Axios from "axios";

const StreamEvents = (props) => {
  const [token, setToken] = useState("");
  const [eventSource, setEventSource] = useState();
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState(["enter a nickname & connect"]);
  const [ctr, setCtr] = useState(0);
  const bottomRef = useRef();
  const inputRef = useRef();

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
      case "3":
        console.log("imposter!");
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
      setToken("");
      setData(["enter a nickname & connect"]);
    }
  };
  const optimistic = (message) => {
    /* 
      anticipate our message being echoed back to us.
      insert message into the data context where we.
      believe it should be.
      when we hear back from the server we will update.
      this removes any delay and makes it seem more responsive.
    */
    setData([
      ...data,
      <Message key={data.length} u={token} ts={Date.now()} message={message} />
    ]);
  };

  return (
    <div className="chat-div-window" {...props}>
      <span className="chat-span-title">
        <h1 className="chat-div-title">{props.title}</h1>
        <button
          className="chat-btn-disconnect"
          onClick={() => startStopEvents(!toggle)}
          disabled={token.length < 3}
        >
          {!toggle ? "connect" : "disconnect"}
        </button>
      </span>

      <LoginModal
        token={token}
        updateToken={updateToken}
        toggle={toggle}
        startStopEvents={startStopEvents}
        open={!(toggle && ctr > 0)}
      />
      <div className="chat-div-messages">
        <div>
          {data}
          <div ref={bottomRef} />
        </div>
      </div>
      <SendMessageForm
        inputRef={inputRef}
        token={token}
        isConnected={toggle && ctr > 0}
        optimistic={optimistic}
      />
    </div>
  );
};

export default StreamEvents;
