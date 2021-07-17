import React from "react";
import "./styles.css";

class ChatGroup extends React.Component {
  render() {
    const {
      groupName,
      lastMessageUserName,
      lastMessageContent,
      selected,
      onClick
    } = this.props;

    return (
      <div className={selected ? "chat-group-selected" : "chat-group"} onClick={onClick}>
        <div className="chat-group-name">{groupName}</div>
        <div className="chat-group-preview">
          {lastMessageUserName}: 
          {lastMessageContent}
        </div>
      </div>
    );
  }
}

export default ChatGroup;
