const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

function getLengthRangeValidator(minLength, maxLength, fieldName) {
  return {
    validator: function(value) {
      if (value === undefined) return false;
      return value.length >= minLength && value.length <= maxLength;
    },
    message: `${fieldName} must be between ${minLength} to ${maxLength} characters`
  };
};

function saltPassword(user, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      cb();
    });
  });
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Email is invalid"
    },
    unique: true
  },
  username: {
    type: String,
    required: true,
    validate: getLengthRangeValidator(4, 20, "username"),
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: getLengthRangeValidator(8, 24, "password")
  },
  facebook: String,
  linkedIn: String,
  twitter: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  picture: String,
  bio: String,
  interests: String
});

UserSchema.pre("save", function(next) {
  const user = this;
  if (user.isModified("password")) {
    saltPassword(user, next);
  } else {
    next();
  }
});

UserSchema.statics.findByEmailPassword = function(email, password) {
  const user = this;
  return user.findOne({ email: email }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  });
};

/* For username based search */
UserSchema.index({ username: "text" });
const User = mongoose.model("User", UserSchema);

module.exports = { User, saltPassword };
