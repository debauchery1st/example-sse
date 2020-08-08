import React from "react";
import StreamEvents from "./StreamEvents";

function App() {
  return (
    <StreamEvents
      title={process.env.REACT_APP_TITLE || "Chat w/ HTML5 Server Sent Events"}
    />
  );
}

export default App;
