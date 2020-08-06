import React from "react";
import StreamEvents from "./StreamEvents";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        height: "99vh",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid grey"
      }}
    >
      <StreamEvents
        style={{
          display: "flex",
          maxWidth: "80ch",
          flexFlow: "row wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "1rem",
          backgroundColor: "beige",
          margin: "1ch",
          color: "grey",
          borderRadius: "10px"
        }}
      />
    </div>
  );
}

export default App;
