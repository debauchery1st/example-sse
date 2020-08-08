import React from "react";
import StreamEvents from "./StreamEvents";

function App({ title }) {
  return <StreamEvents title={title || "Chat w/ HTML5 Server Sent Events"} />;
}

export default App;
