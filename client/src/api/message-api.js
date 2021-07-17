import { getCurrentUserInfoNonBlocking } from "./login-api";
import { getUserMetaData } from "./user-api";

let messages = [];
let ws = null;
const observerCallback = new Map();

export function initMessageClient() {
  loadMessages();
  const loc = window.location;
  let wsUrl =
    loc.protocol === "https:" ? "wss://" + loc.host : "ws://" + loc.host;
  ws = new WebSocket(wsUrl);

  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    msg.viewed = false;
    const sender =
      msg.type === "group"
        ? msg.to
        : getCurrentUserInfoNonBlocking()._id === msg.to
        ? msg.from
        : msg.to;
    const tabIndex = messages.findIndex((m) => m.tabId === sender);
    if (tabIndex === -1) {
      loadMessages();
    } else {
      if (!messages[tabIndex].members[msg.from])
        getUserMetaData(msg.from, (user) => {
          messages[tabIndex].members[msg.from] = user.username;
          observerCallback.forEach((ob) => ob(messages));
        });
      messages[tabIndex].msg.push(msg);
      observerCallback.forEach((ob) => ob(messages));
    }
  };
}

export function addObserverCallback(callback, id) {
  observerCallback.set(id, callback);
}

export function markTabAsViewed(tabId) {
  const tabMsgs = messages.find((m) => m.tabId === tabId);
  const mids = [];
  for (let msg of tabMsgs) {
    msg.viewed = true;
    mids.push(msg._id);
  }
  const request = new Request("/api/message", {
    method: "post",
    body: JSON.stringify(mids),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  fetch(request);
}

export function loadMessages() {
  const request = new Request("/api/message", {
    method: "get",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(request)
    .then((res) => res.json())
    .then((msg) => {
      messages = msg;
      observerCallback.forEach((ob) => ob(messages));
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getMessages() {
  return messages;
}

export function addUsertoChat(uid, username) {
  if (
    getCurrentUserInfoNonBlocking() &&
    !messages.find((m) => m.tabId === uid)
  ) {
    messages.push({
      tabId: uid,
      members: {
        [uid]: username,
        [getCurrentUserInfoNonBlocking()._id]:
          getCurrentUserInfoNonBlocking().username,
      },
      type: "user",
      msg: [],
    });
    observerCallback.forEach((ob) => ob(messages));
  }
}

export function closeWs() {
  if (ws) ws.close();
}

export function sendMessage(content, to, type) {
  if (ws) ws.send(JSON.stringify({ to: to, type: type, content: content }));
}
