import React from "react";

const Message = (props) => {
  // console.log(props);
  // const o = JSON.parse(rawdata);
  return <pre>{`<${props.u || "system"}/> ${props.message}`}</pre>;
};

export default Message;
