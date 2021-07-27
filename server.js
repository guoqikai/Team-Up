"use strict";

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://guoqikai:guoqikai@cluster0.kkqgw.mongodb.net/teamup?retryWrites=true&w=majority";
console.log(mongoURI);

mongoose.promise = global.Promise;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(`Error: ${err}`));

const session = require("express-session");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const {
  updateProject,
  createProject,
  deleteProject,
  canEditProject,
  findProjectById,
  findProjects,
  incrementViews,
  incrementLikes,
} = require("./project-service");
const {
  findUserById,
  findUsers,
  createUser,
  findUserByEmailPassword,
  updateUser,
  removeUser,
  getRandomUsers,
} = require("./user-service");
const {
  addRoleToProject,
  applyToRole,
  acceptRole,
  rejectRole,
  deleteRole,
  deleteProjectRoles,
  deleteUserProjectRoles,
  findRoles,
} = require("./role-service");
const { uploadImage, deleteImage } = require("./image-service");
const {
  wss,
  getUserMessages,
  updateUserViewed,
  addUserToGroup,
  removeUserFromGroup,
  initUserSub,
  createGroup,
  deleteGroup,
} = require("./message-service");
const {
  createSkill,
  joinSkill,
  leaveSkill,
  deleteSkill,
  findSkills,
} = require("./skill-service");

mongoose.set("useFindAndModify", false);

const app = express();
const sessionParser = session({
  secret: "teamUp-csc309",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 30 * 1000,
    httpOnly: true,
  },
});
const PAGE_SIZE = 30;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(sessionParser);

app.use(express.static(__dirname + "/client/build"));

const checkSession = (req, onSuccess, onfailure) => {
  if (!req.session || !req.session.user) {
    onfailure();
    return;
  }
  findUserById(req.session.user)
    .then((user) => {
      user ? onSuccess(user) : onfailure();
    })
    .catch((error) => {
      onfailure(error);
    });
};

const authenticate = (req, res, next) => {
  checkSession(
    req,
    (user) => {
      req.user = user;
      next();
    },
    () => res.status(401).send("Unauthorized")
  );
};

const getCurrentUserInfo = (req, res, next) => {
  checkSession(
    req,
    (user) => {
      req.user = user;
      next();
    },
    () => {
      next();
    }
  );
};

/* Create User */
app.post("/api/register", (req, res) => {
  createUser(req.body.email, req.body.username, req.body.password)
    .then((user) => {
      initUserSub(user._id);
      req.session.user = user._id;
      res.send(user);
    })
    .catch((e) => res.status(e.errorCode).send(e.error));
});

app.get("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  findUserByEmailPassword(email, password)
    .then((user) => {
      req.session.user = user._id;
      res.send(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send();
    });
});

app.get("/api/login", authenticate, (req, res) => {
  res.send(req.user);
});

app.get("/api/message", authenticate, (req, res) => {
  getUserMessages(req.user._id, req.user.groups)
    .then((msgs) => {
      const queries = [];
      for (let i = 0; i < msgs.length; i++) {
        queries.push(
          findUsers({
            _id: {
              $in: msgs[i].members,
            },
          }).then((users) =>
            users.reduce((s, users) => {
              s[users._id] = users.username;
              return s;
            }, {})
          )
        );
      }
      Promise.all(queries)
        .then((mems) => {
          for (let i = 0; i < msgs.length; i++) {
            msgs[i].members = mems[i];
          }
          res.send(msgs);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send();
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

/* this should be call when user viewed an unviewed message */
app.post("/api/message", authenticate, (req, res) => {
  updateUserViewed(req.user._id, req.body.sender)
    .then(() => {
      res.send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.get("/api/user", (req, res) => {
  const id = req.query.id;
  const search = req.query.search;
  let query;
  if (id) {
    query = findUserById(id);
  } else if (search) query = findUsers({ $text: { $search: search } });
  else query = getRandomUsers(PAGE_SIZE);
  query
    .then((u) => {
      if (!u) return res.status(404).send();
      res.send(u);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.get("/api/user-detail:id", (req, res) => {
  const id = req.query.id;
  findUserById({ username: username }).then((user) => {
    if (!user) return res.status(404).send;
  });
});

app.patch("/api/user", authenticate, (req, res) => {
  let id = req.user.isAdmin ? req.body._id : req.user._id;
  if (
    req.body.password &&
    (req.body.password.length < 8 || req.body.password.length > 24)
  )
    return res.status(400).send("password must be between 8 to 24 characters");
  updateUser(id, req.body)
    .then((user) => {
      if (!user) {
        res.status(404).send();
      }
      if (req.body.picture && user.picture) {
        deleteImage(user.picture);
      }
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.delete("/api/user/:id", authenticate, (req, res) => {
  if (!user.isAdmin) return res.status(401).send();
  const id = req.params.id;
  removeUser(id).then((result) => {
    if (result.picture) deleteImage(result.picture);
  });
});

app.get("/api/project/:id", (req, res) => {
  const projectId = req.params.id;

  return findProjectById(projectId)
    .then((project) => {
      incrementViews(projectId);
      res.send(project);
    })
    .catch((error) => res.status(500).send());
});

app.get("/api/project/", (req, res) => {
  if (req.query.userId) {
    const queryUserId = req.query.userId;
    findRoles({ userId: queryUserId })
      .then((role) => {
        const projIds = role.map((role) => role.projectId);
        return findProjects({
          $or: [
            { _id: { $in: projIds } },
            { owner: queryUserId },
            { admin: queryUserId },
          ],
        });
      })
      .then((project) => {
        if (!project) {
          res.status(404).send();
        }
        res.send(project);
      })
      .catch((error) => {
        res.status(404).send();
      });
  } else {
    const page = req.query.page ? req.query.page : 0;
    const search = req.query.search
      ? { $text: { $search: req.query.search } }
      : {};
    findProjects(search, {
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort: { created: -1 },
    })
      .then((projects) => {
        projects = projects.map((p) => p.toObject());
        Promise.all(
          projects.map((p) =>
            findRoles({ projectId: p._id }).then((roles) => {
              const pUsers = roles.map((r) =>
                r.userId
                  ? findUserById(r.userId).then((user) => {
                      return {
                        _id: user._id,
                        username: user.username,
                        picture: user.picture,
                      };
                    })
                  : null
              );
              return Promise.all(pUsers).then((users) =>
                roles.map((r, i) => {
                  r = r.toObject();
                  r.user = users[i];
                  return r;
                })
              );
            })
          )
        )
          .then((roles) => {
            projects.forEach((p, index) => {
              p.roles = roles[index];
            });
            res.send(projects);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send();
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send();
      });
  }
});

app.post("/api/project", authenticate, (req, res) => {
  if (!req.body.title) return res.status(400).send();

  const create = (groupId) =>
    createProject(
      req.body.title,
      req.body.image,
      req.user._id,
      groupId,
      req.body.description
    )
      .then((project) => {
        res.send(project);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send();
      });

  if (req.body.createGroup) {
    createGroup(req.body.title)
      .then((group) => {
        addUserToGroup(req.user._id, group._id);
        create(group._id);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send();
      });
  } else {
    create();
  }
});

app.patch("/api/project/:id", authenticate, (req, res) => {
  const projectId = req.params.id;

  const uid = req.user.isAdmin ? null : req.user._id;
  const update = req.body;
  updateProject(projectId, uid, update)
    .then((result) => {
      if (!result) res.status(400).send();
      else {
        if (update.image && result.image) deleteImage(result.image);
        res.send(result);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.delete("/api/project/:id", authenticate, (req, res) => {
  const projectId = req.params.id;
  const uid = req.user.isAdmin ? null : req.user._id;
  deleteProject(projectId, uid)
    .then((result) => {
      if (!result) return res.status(403).send();
      deleteProjectRoles(projectId);
      if (result.image) deleteImage(result.image);
      if (result.group) deleteGroup(result.group);
      res.send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.delete("/api/project-member/:id", authenticate, (req, res) => {
  const projectId = req.params.id;
  findProjectById(projectId)
    .then((project) => {
      if (project && project.group)
        return removeUserFromGroup(req.user._id, project.group);
    })
    .then(() => deleteUserProjectRoles(req.user._id, projectId))
    .then(() => res.send())
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.patch("/api/project/increment-likes/:id", authenticate, (req, res) => {
  const projectId = req.params.id;
  if (req.session.liked && req.session.liked.includes(projectId)) {
    return res.status(403).send();
  }
  incrementLikes(projectId)
    .then((r) => {
      if (req.session.liked) req.session.liked.push(projectId);
      else req.session.liked = [projectId];
      res.send(r);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/apply-role/:id", authenticate, (req, res) => {
  const roleId = req.params.id;

  applyToRole(roleId, req.user._id)
    .then((result) => {
      if (!result) return res.status(403).send();
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.get("/api/project-roles/:id", (req, res) => {
  const projectId = req.params.id;

  findRoles({ projectId: projectId })
    .then((roles) => {
      res.send(roles);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.get("/api/project/can-edit/:id", getCurrentUserInfo, (req, res) => {
  const projectId = req.params.id;

  if (!req.user) {
    res.status(403).send("Unauthorized");
  } else {
    findProjectById(projectId)
      .then((project) =>
        res.send({ canEdit: canEditProject(project, req.user._id) })
      )
      .catch((error) => {
        console.log(error);
        res.status(500).send();
      });
  }
});

app.get("/api/user/can-edit/:id", getCurrentUserInfo, (req, res) => {
  const userIdToEdit = req.params.id;

  if (!req.user) {
    res.send({ canEdit: false });
  } else {
    res.send({
      canEdit: (user && user.isAdmin) || user._id.equals(userIdToEdit),
    });
  }
});

app.get("/api/my-project", authenticate, (req, res) => {
  findRoles({ userId: req.user._id })
    .then((roles) =>
      Promise.all([
        findProjects({
          $or: [{ owner: req.user._id }, { admins: req.user._id }],
        }),
        findProjects({ _id: { $in: roles.map((r) => r.projectId) } }),
      ])
    )
    .then((resolved) =>
      res.send(
        resolved[0]
          .concat(resolved[1])
          .filter(
            (v, i, a) =>
              a.findIndex((t) => t._id.toString() === v._id.toString()) === i
          )
          .map((p) => {
            return {
              _id: p._id,
              title: p.title,
              image: p.image,
              role: p.owner.equals(req.user._id)
                ? "Owner"
                : p.admins.includes(req.user._id)
                ? "Admin"
                : "Member",
            };
          })
      )
    )
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/role", authenticate, (req, res) => {
  findProjectById(req.body.projectId)
    .then((project) => {
      if (canEditProject(project, req.user._id))
        return addRoleToProject(req.body.projectId, req.body.title).then(
          (role) => res.send(role)
        );
      res.status(403).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/accept-role", authenticate, (req, res) => {
  if (!req.body.projectId || !req.body._id || !req.body.acceptUserId) {
    res.status(400).send();
    return;
  }
  findProjectById(req.body.projectId)
    .then((project) => {
      if (!canEditProject(project, req.user._id)) return res.status(403).send();
      acceptRole(req.body._id, req.body.acceptUserId).then((role) => {
        if (!role) return res.status(400).send();
        if (project.group && req.body.userId) {
          addUserToGroup(req.body.userId, project.group).catch((error) =>
            console.log(error)
          );
        }
        res.send();
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/reject-role", authenticate, (req, res) => {
  if (!req.body.projectId || !req.body._id || !req.body.rejectUserId) {
    res.status(400).send();
    return;
  }
  findProjectById(req.body.projectId)
    .then((project) => {
      if (!canEditProject(project, req.user._id)) return res.status(403).send();
      rejectRole(req.body._id, req.body.rejectUserId).then(() => res.send());
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.delete("/api/role", authenticate, (req, res) => {
  findProjectById(req.body.projectId)
    .then((project) => {
      if (
        !canEditProject(project, req.user._id) &&
        req.user._id !== req.body.userId
      )
        return res.status(403).send();
      deleteRole({
        _id: req.body._id,
        projectId: project._id,
        userId: req.body.userId,
      }).then((role) => {
        if (project.group) {
          findRoles({ userId: role.userId, projectId: req.body.projectId })
            .then((roles) => {
              if (
                roles.length === 0 &&
                project.owner !== role.userId &&
                !project.admins.includes(role.userId)
              ) {
                return removeUserFromGroup(role.userId, project.group);
              }
            })
            .catch((error) => console.log(error));
          res.send();
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(403).send();
    });
});

app.post("/api/skill", authenticate, (req, res) => {
  if (!req.body.title) return res.status(400).send();
  createGroup(req.body.title)
    .then((group) =>
      createSkill(
        req.body.title,
        req.body.image,
        group._id,
        req.body.description
      )
    )
    .then(res.send())
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/join-skill/:id", authenticate, (req, res) => {
  const skillId = req.params.id;
  joinSkill(req.user._id, skillId)
    .then((skill) => {
      if (skill)
        addUserToGroup(req.user._id, skill.group).then(() => res.send());
      else res.status(400).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/leave-skill/:id", authenticate, (req, res) => {
  const skillId = req.params.id;
  leaveSkill(req.user._id, skillId)
    .then((skill) => removeUserFromGroup(req.user._id, skill.group))
    .then(() => res.send())
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.delete("/api/skill/:id", authenticate, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).send();
  const skillId = req.params.id;

  deleteSkill(skillId)
    .then((skill) => deleteGroup(skill.group))
    .then(() => res.send())
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.get("/api/skill", getCurrentUserInfo, (req, res) => {
  const page = req.query.page ? req.query.page : 0;
  const search = req.query.search
    ? { $text: { $search: req.query.search } }
    : {};
  findSkills(search, {
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    sort: { relevantUsers: 1 },
  })
    .then((skills) =>
      res.send(
        skills.map((skill) => ({
          _id: skill._id,
          title: skill.title,
          image: skill.image,
          description: skill.description,
          joined: req.user ? skill.relevantUsers.includes(req.user._id) : false,
        }))
      )
    )
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.post("/api/image", multipartMiddleware, (req, res) => {
  uploadImage(req.files.image.path)
    .then((result) => {
      res.send({ url: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send();
    });
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.on("upgrade", function (request, socket, head) {
  sessionParser(request, {}, () =>
    checkSession(
      request,
      (user) => {
        request.user = user;
        wss.handleUpgrade(request, socket, head, function (ws) {
          wss.emit("connection", ws, request);
        });
      },
      (error) => {
        socket.destroy();
      }
    )
  );
});

server.listen(port, () => console.log(`Listening on port ${port}...`));
