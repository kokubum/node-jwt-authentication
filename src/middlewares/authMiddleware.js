const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const authService = require("../services/authService");

const protectedRoute = catchAsync(async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return next(new AppError("No authorization header", 400));
  }
  const rawToken = bearerToken.split(" ");

  if (rawToken.length !== 2 || !/^Bearer$/i.test(rawToken[0])) {
    return next(new AppError("Poorly formatted authorization header", 400));
  }
  const { user, decodedToken } = await authService.findUserWithToken(
    rawToken[1]
  );

  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  const blacklistToken = await authService.getRevokedToken(decodedToken.jti);

  if (blacklistToken) {
    return next(new AppError("Revoked token", 401));
  }

  if (authService.passwordWasChangedAfter(decodedToken.iat, user)) {
    return next(new AppError("User recently changed password", 401));
  }

  req.user = user;
  req.token = decodedToken;
  next();
});

module.exports = protectedRoute;
