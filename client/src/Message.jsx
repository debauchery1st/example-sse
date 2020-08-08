import React from "react";

const Message = (props) => {
  return <pre>{`<${props.u || "system"}/> ${props.message}`}</pre>;
};

export default Message;
