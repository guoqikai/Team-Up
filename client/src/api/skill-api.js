import { loadMessages } from "./message-api";

export function joinSkill(sid, callback) {
  const request = new Request("/api/join-skill/" + sid, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        loadMessages();
        callback(null, true);
      } else {
        callback(null, false);
      }
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
}

export function leaveSkill(sid, callback) {
  const request = new Request("/api/leave-skill/" + sid, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        loadMessages();
        callback(null, true);
      } else {
        callback(null, false);
      }
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
}
