import React from "react";
import "./styles.css";


class Message extends React.Component {
  render() {
    const { content, user, isOutgoing } = this.props;

    return (
      <div className="chat-message">
        <div
          className={
            "chat-message-name " +
            (isOutgoing ? "chat-message-name-outgoing" : "")
          }
        >
          {user}
        </div>
        <div
          className={
            "chat-message-content " +
            (isOutgoing ? "chat-message-content-outgoing" : "")
          }
        >
          {content}
        </div>
      </div>
    );
  }
}

export default Message
