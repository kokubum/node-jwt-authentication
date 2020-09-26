const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");

const register = catchAsync(async (req, res, next) => {
  const { confirmPassword, password } = req.body;
  if (password !== confirmPassword) {
    return next(
      new AppError("Your password and confirm password must match", 400)
    );
  }
  const userFields = { ...req.body };

  const user = await authService.savingUser(userFields);
  user.password = undefined;
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await authService.findUser(email);
  const validPassword = await authService.checkPassword(user, password);

  if (!user || !validPassword) {
    return next(new AppError("Invalid email or password", 401));
  }

  token = await authService.generateToken(user);

  return res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});

const logout = catchAsync(async (req, res, next) => {
  const { iat, exp, jti } = req.token;
  await authService.logoutUser(iat, exp, jti);
  res.status(200).json({
    status: "success",
    data: {
      message: "User logout successfuly",
    },
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  if (!password || !newPassword || !confirmNewPassword) {
    return next(new AppError("Empty fields are not allowed", 400));
  }
  const user = req.user;
  const validPassword = await authService.checkPassword(user, password);

  if (!validPassword) {
    return next(new AppError("Invalid password", 401));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new AppError("Your password and confirm password must match", 400)
    );
  }

  await authService.changePassword(user, newPassword);
  return res.status(200).json({
    status: "success",
    message: "The password was updated",
  });
});

const protected = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: `Welcome to the protected route ${req.user.firstName} ${req.user.lastName}`,
  });
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
  protected,
};
