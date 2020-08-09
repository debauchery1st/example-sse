import React from "react";

const Message = (props) => {
  return (
    <span className="chat-span-message">
      <p className="chat-p-message">{`<${props.u || "system"}>`}</p>
      <pre className="chat-pre-message">{`${props.message}`}</pre>
    </span>
  );
};

export default Message;
