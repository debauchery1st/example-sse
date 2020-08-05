import React, { useState } from "react";

const StreamEvents = (props) => {
  const [eventSource, setEventSource] = useState();
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState([]);

  const updateDisplay = (msg) => {
    setData([...msg]);
  };

  const startStopEvents = (b) => {
    if (b) {
      if (eventSource) {
        // if already open, close handle
        eventSource.close();
      }
      console.log("start events");
      const es = new EventSource(`http://localhost:4001/stream`); // open stream
      es.onmessage = (e) => updateDisplay(JSON.parse(e.data)); // process events
      setEventSource(es); // store handle
      setToggle(true);
    } else {
      console.log("stop events");
      if (eventSource) {
        eventSource.close(); // close stream
      }
      setEventSource(undefined); // remove handle
      setToggle(false);
    }
  };
  return (
    <div {...props}>
      <h2>HTML5 Server Side Events</h2>
      <p>{data}</p>
      <button onClick={() => startStopEvents(!toggle)}>
        {!toggle ? "start" : "stop"}
      </button>
    </div>
  );
};

export default StreamEvents;
