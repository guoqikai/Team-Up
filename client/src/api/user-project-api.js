import { loadMessages } from "./message-api";

export function getCurrentUserProjectInfo(callback) {
  const request = new Request("/api/my-project", {
    method: "get",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        res.json().then((body) => {
          callback(body, true);
        });
      } else {
        callback(null, false);
      }
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
}

export function exitProject(id, callback) {
  const request = new Request("/api/project-member/" + id, {
    method: "delete",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(request)
    .then(() => {
      loadMessages();
      callback();
    })
    .catch((error) => {
      console.log(error);
    });
}

export function deleteProject(id, callback) {
  const request = new Request("/api/project/" + id, {
    method: "delete",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(request)
    .then(() => {
      loadMessages();
      callback();
    })
    .catch((error) => {
      console.log(error);
    });
}
