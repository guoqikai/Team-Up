"use strict";

const { User, saltPassword } = require("./models/user");

function handleError(error) {
  if (error.name === "ValidationError") {
    const backMsg = {};
    const errors = error.errors;
    for (var err in errors) {
      backMsg[err] = errors[err].message;
    }
    throw { errorCode: 400, error: backMsg };
  }
  if (error.name === "MongoError") {
    if (error.code === 11000) {
      const incorrectField = Object.keys(error.keyValue)[0];
      throw {
        errorCode: 400,
        error: { [incorrectField]: `The ${incorrectField} already exist` },
      };
    } else throw { errorCode: 500 };
  } else throw { errorCode: 500 };
}

function findUserByEmailPassword(email, password) {
  return User.findByEmailPassword(email, password);
}

function findUserById(id) {
  return User.findById(id).select("-password -isAdmin").exec();
}

function findUsers(cond) {
  return User.find(cond).select("-password -isAdmin").exec();
}

function getRandomUsers(size) {
  return User.aggregate([
    { $sample: { size: size } },
    { $project: { password: false, isAdmin: false } },
  ]).exec();
}

function createUser(email, username, password) {
  return new User({
    email: email,
    username: username,
    password: password,
  })
    .save()
    .catch(handleError);
}


function updateUser(id, update) {
  delete update.username;
  delete update.email;
  delete update.isAdmin;
  update._id = id;
  const p = new Promise((resolve, reject) =>  {
    if (update.password) {
      saltPassword(update, () => resolve(update))
    }
    else resolve(update);
});
  
  return p.then(saltupdate => User.findByIdAndUpdate(id, update)
    .select("-password -isAdmin")
    .exec())
}

function removeUser(id) {
  return User.findByIdDelete(id).select("-password -isAdmin").exec();
}

module.exports = {
  findUserByEmailPassword,
  findUserById,
  findUsers,
  getRandomUsers,
  createUser,
  updateUser,
  removeUser,
};
