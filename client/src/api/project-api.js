/* Auth is handled server side */
import { uploadImage } from "./image-api";
import { loadMessages } from "./message-api";

export function createProject(
  projectTitle,
  description,
  createGroup,
  imageFormData,
  callback
) {
  uploadImage(imageFormData, (imageUrl) => {
    const createRequest = new Request("/api/project", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: projectTitle,
        description: description,
        image: imageUrl,
        createGroup: createGroup,
      }),
    });

    fetch(createRequest)
      .then((res) => {
        if (res.status === 200) {
          res.json().then((body) => {
            loadMessages();
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
  });
}

export function canEdit(projectId, callback) {
  const getRequest = new Request(`/api/project/can-edit/${projectId}`);
  fetch(getRequest)
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          callback(json.canEdit, true);
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

export function getProjectDetail(projectId, callback) {
  const getRequest = new Request(`/api/project/${projectId}`, {
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
      } else {
        callback(null, false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getRoles(projectId, callback) {
  const getRequest = new Request(`/api/project-roles/${projectId}`, {
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
        throw new Error("Server Error");
      } else {
        throw new Error("Client Error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function likeProject(projectId, callback) {
  const likeRequest = new Request(`/api/project/increment-likes/${projectId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(likeRequest)
    .then((res) => {
      if (res.status === 200) {
        callback(null);
      } else {
        callback(res.status);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function editProject(projectId, updateParams, callback) {
  const editRequest = new Request(`/api/project/${projectId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...updateParams,
    }),
  });

  fetch(editRequest)
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

export function applyToRole(roleId, callback) {
  const postReq = new Request(`/api/apply-role/${roleId}`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(postReq)
    .then((res) => {
      if (res.status === 200) {
        callback(null, true);
      } else if (res.status >= 500) {
        callback("Server error", true);
      } else {
        callback("Client error", false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function createRole(projectId, title, callback) {
  const postReq = new Request("/api/role/", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      projectId: projectId,
    }),
  });

  fetch(postReq)
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

export function deleteRole(projectId, roleId, callback) {
  const delReq = new Request("/api/role/", {
    method: "DELETE",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      _id: roleId,
    }),
  });

  fetch(delReq)
    .then((res) => {
      if (res.status === 200) {
        callback(null, true);
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

export function deleteProject(projectId, callback) {
  const delReq = new Request(`/api/project/${projectId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(delReq)
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

export function getProjectsUnderUser(userId, callback) {
  const getReq = new Request(`/api/project/?userId=${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(getReq)
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

export function acceptApplication(projectId, roleId, userId, callback) {
  const patchReq = new Request("/api/accept-role/", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: projectId,
      _id: roleId,
      acceptUserId: userId,
    }),
  });

  fetch(patchReq)
    .then((res) => {
      if (res.status === 200) {
        callback(null, true);
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

export function rejectApplication(projectId, roleId, userId, callback) {
  const patchReq = new Request("/api/reject-role/", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: projectId,
      _id: roleId,
      rejectUserId: userId,
    }),
  });

  fetch(patchReq)
    .then((res) => {
      if (res.status === 200) {
        callback(null, true);
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
