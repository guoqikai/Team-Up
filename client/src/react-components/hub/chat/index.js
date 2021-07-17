import React from "react";
import "./styles.css";
import {
  sendMessage,
  getMessages,
  markTabAsViewed,
  addObserverCallback,
} from "../../../api/message-api";

import { getCurrentUserInfoNonBlocking } from "../../../api/login-api";

import Tab from "./chat-group";
import Message from "./message";

function getTabName(msgMod) {
  return msgMod.tabName || msgMod.members[msgMod.tabId] || "unknown";
}

function gotoBottom() {
  var element = document.querySelector(".chat-conversation-messages");
  element.scrollTop = element.scrollHeight - element.clientHeight;
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const msgsMod = getMessages();
    this.state = {
      selectedTabId: msgsMod.length > 0 ? msgsMod[0].tabId : null,
      msgsMod: msgsMod,
    };
    addObserverCallback(this.onMessagesUpdate.bind(this), "chat");
  }

  componentDidUpdate() {
    gotoBottom();
  }

  componentDidMount() {
    gotoBottom();
  }

  onMessagesUpdate(msgsMod) {
    this.setState({
      selectedTabId: msgsMod
        .map((m) => m.tabId)
        .includes(this.state.selectedTabId)
        ? this.state.selectedTabId
        : msgsMod.length > 0
        ? msgsMod[0].tabId
        : null,
      msgsMod: msgsMod,
    });
  }

  createChatGroupComponenent(msgMod) {
    const lastMessage = msgMod.msg[msgMod.msg.length - 1];
    return (
      <Tab
        groupName={getTabName(msgMod)}
        lastMessageUserName={
          lastMessage ? msgMod.members[lastMessage.from] : ""
        }
        lastMessageContent={lastMessage ? lastMessage.content : ""}
        key={msgMod.tabId}
        selected={msgMod.tabId === this.state.selectedTabId}
        onClick={() => this.setState({ selectedTabId: msgMod.tabId })}
      />
    );
  }

  render() {
    const { onCloseClick } = this.props;

    const msgMod =
      this.state.selectedTabId &&
      this.state.msgsMod.find((m) => m.tabId === this.state.selectedTabId);
    return (
      <div className="chat">
        {this.state.selectedTabId ? (
          <div className="chat-groups">
            {this.state.msgsMod.map((msg) =>
              this.createChatGroupComponenent(msg)
            )}
          </div>
        ) : null}
        <div className="chat-conversation">
          <div className="chat-conversation-header">
            <span className="chat-conversation-header-text">
              {msgMod ? getTabName(msgMod) : "No Message Yet"}
            </span>
            <span className="chat-exit" onClick={onCloseClick}>
              X
            </span>
          </div>
          <div className="chat-conversation-messages">
            {msgMod &&
              msgMod.msg.map((msg, i) => (
                <Message
                  content={msg.content}
                  user={
                    msgMod.members[msg.from]
                      ? msgMod.members[msg.from]
                      : "unknown"
                  }
                  isOutgoing={
                    msgMod.type === "user"
                      ? msgMod.tabId === msg.to
                      : getCurrentUserInfoNonBlocking()._id === msg.from
                  }
                  key={i}
                />
              ))}
          </div>
          <div className="chat-conversation-input-container">
            {msgMod && (
              <input
                autocomplete="off"
                id="chat-input"
                type="text"
                placeholder="Type a message..."
                className="chat-conversation-input-text"
                value={msgMod.input || ""}
                onChange={(e) => {
                  msgMod.input = e.target.value;
                  this.setState({ msgsMod: this.state.msgsMod });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.length > 0) {
                    sendMessage(e.target.value, msgMod.tabId, msgMod.type);
                    msgMod.input = "";
                    this.setState({ msgsMod: this.state.msgsMod });
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
