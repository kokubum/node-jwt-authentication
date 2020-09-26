const router = require("express").Router();
const protectedRoute = require("../middlewares/authMiddleware");

const authController = require("../controllers/authController");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", protectedRoute, authController.logout);

router.post("/change-password", protectedRoute, authController.changePassword);

router.get("/protected", protectedRoute, authController.protected);

module.exports = router;
