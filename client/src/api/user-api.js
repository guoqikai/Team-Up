import { uploadImage } from "./image-api";

export function getUserMetaData(userId, callback) {
  getUser(userId, (res) => {
    const filtered = {
      picture: res.picture,
      username: res.username,
      bio: res.bio,
      uid: res._id,
    };
    callback(filtered, true);
  });
}

export function canEdit(userId, callback) {
  const getRequest = new Request(`/api/user/can-edit/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(getRequest)
    .then((res) => {
      if (res.status === 200) {
        res.json().then((body) => {
          callback(body.canEdit, true);
        });
      } else if (res.status >= 500) {
        callback("Server error", false);
      } else {
        callback("Client error", false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function editUser(userId, editParams, callback) {
  console.log("Sending User Edit");
  const patchReq = new Request(`/api/user/`, {
    method: "PATCH",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: userId,
      ...editParams,
    }),
  });

  fetch(patchReq)
    .then((res) => {
      if (res.status === 200) {
        console.log(res);
        res.json().then((body) => {
          callback(body, true);
        });
      } else if (res.status >= 500) {
        callback("Server error", false);
      } else {
        callback("Client error", false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getUser(userId, callback) {
  const getRequest = new Request(`/api/user/?id=${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(getRequest)
    .then((res) => {
      if (res.status === 200) {
        res.json().then((body) => {
          callback(body, true);
        });
      } else if (res.status >= 500) {
        callback("Server error", false);
      } else {
        callback("Client error", false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getUsersMetaData(search = "", page = 0, callback) {
  getUsers(search, page, (res) => {
    const filtered = Object.keys(res).map((key) => {
      res[key] = {
        image: res[key].image,
        title: res[key].username,
        description: res[key].bio,
        uid: res[key]._id,
      };
    });
    callback(filtered, true);
  });
}

export function getUsers(search = "", page = 0, callback) {
  const getRequest = new Request(
    `/api/project/?page=${page}&search=${search}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    }
  );

  fetch(getRequest)
    .then((res) => {
      if (res.status === 200) {
        res.json().then((body) => {
          callback(body, true);
        });
      } else if (res.status >= 500) {
        callback("Server error", false);
      } else {
        callback("Client error", false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function updateCurrentUser(data, callback) {
  uploadImage(data.pictureData, url => {
  if (url) data.picture = url;
  Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
  delete data.pictureData;
  const request = new Request(
    "/api/user",
    {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    }
  );

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        callback(null, true);
      } else if (res.status === 401) {
        callback("unauth", false);
      } 
      else if (res.status === 400) {
        console.log(res)
        res.text().then((body) =>  callback(body, true));
      }
    })
    .catch((error) => {
      console.log(error);
    });
  });
}
