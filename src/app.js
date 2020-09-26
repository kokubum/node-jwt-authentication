const express = require("express");
const authRouter = require("./routes/auth");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const errorGlobalHandler = require("./controllers/errorController");

app = express();

// Secure http headers
app.use(helmet());

// Rate limit for the number of requests
const limiter = rateLimit({
  max: 1,
  windowMs: 3600 * 1000,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again in an hour",
  },
});
// Limiting the requests
app.use("/api", limiter);

// Treat the json limit and parser
app.use(express.json({ limit: "10kb" }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use("/api/v1/auth", authRouter);

app.use(errorGlobalHandler);

module.exports = app;
