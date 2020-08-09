import React, { useRef, useEffect } from "react";
import ReactDom from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: `50%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
  backgroundColor: "#121212",
  border: `1px solid #272727`,
  padding: `15ch`,
  maxWidth: `100vw`,
  zIndex: 1000,
  borderRadius: "1ch"
};

const OVERLAY_STYLES = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  position: "fixed",
  backgroundColor: "rgba(0, 0, 0, .9)"
};

const LoginModal = ({ open, token, updateToken, toggle, startStopEvents }) => {
  const inputRef = useRef();
  const btnRef = useRef();
  useEffect(() => {
    open && inputRef.current.focus();
  }, [open]);
  if (!open) return null;
  const onKeyUp = (e) => {
    if (e.charCode === 13) {
      btnRef.current.click();
    }
  };

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div className="chat-div-modal" style={MODAL_STYLES}>
        <div className="chat-div-login">
          <input
            ref={inputRef}
            className="chat-input-name"
            placeholder="nickname"
            value={token}
            onKeyPress={onKeyUp}
            onChange={updateToken}
            disabled={toggle}
            autofocus
          />
          <button
            ref={btnRef}
            className="chat-btn-connect"
            onClick={() => startStopEvents(!toggle)}
            disabled={token.length < 3}
          >
            {!toggle ? "connect" : "disconnect"}
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default LoginModal;
