const User = require("../models/userModel");
const redisBlacklist = require("../db/blacklist");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const config = require("../config");

const savingUser = async (userFields) => {
  const filteredUser = {
    firstName: userFields.firstName,
    lastName: userFields.lastName,
    username: userFields.username,
    email: userFields.email,
    password: userFields.password,
  };
  return User.create(filteredUser);
};

const findUser = async (email) => {
  return User.findOne({ email });
};

const checkPassword = async (user, password) => {
  return user.checkPassword(password);
};

const generateToken = async (user) => {
  return user.generateAuthToken();
};

const logoutUser = async (iat, exp, jti) => {
  const blacklistSet = promisify(redisBlacklist.set).bind(redisBlacklist);
  await blacklistSet(jti, "true");
  redisBlacklist.expire(jti, exp - iat);
};

const changePassword = async (user, newPassword) => {
  user.password = newPassword;
  await user.save();
};

const findUserWithToken = async (token) => {
  const decodedToken = await promisify(jwt.verify)(token, config.SECRET_KEY);
  const user = await User.findById(decodedToken.id);

  return { user, decodedToken };
};

const getRevokedToken = async (jti) => {
  const blacklistGet = promisify(redisBlacklist.get).bind(redisBlacklist);
  return blacklistGet(jti);
};

const passwordWasChangedAfter = (iat, user) => {
  return user.changePasswordAfter(iat);
};

module.exports = {
  savingUser,
  findUser,
  checkPassword,
  generateToken,
  logoutUser,
  changePassword,
  findUserWithToken,
  getRevokedToken,
  passwordWasChangedAfter,
};
