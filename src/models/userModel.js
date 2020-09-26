const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const config = require("../config");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
    trim: true,
  },

  username: {
    type: String,
    required: [true, "Please provide an username"],
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },

  password: {
    type: String,

    required: true,
    minlength: [10, "Your password must have at least 10 characters"],
    validate: {
      validator: function (value) {
        // 1 lower case, 1 upper case, 1 number, 1 special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]*$/.test(
          value
        );
      },
      message:
        "You password must have at least 1 lower case and upper case, 1 number, and 1 special character",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) this.passwordChangedAt = Date.now();

  next();
});

userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  const payload = {
    id: this.id,
    jti: uuid(),
  };
  return jwt.sign(payload, config.SECRET_KEY, {
    expiresIn: config.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.changePasswordAfter = function (issueAtToken) {
  const timeInSeconds = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

  return timeInSeconds > issueAtToken;
};

module.exports = mongoose.model("User", userSchema);
