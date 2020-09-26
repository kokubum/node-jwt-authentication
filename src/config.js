const dotenv = require("dotenv");
const path = require("path");

const envPath = path.join(__dirname, "../.env");

dotenv.config({
  path: envPath,
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_URI: process.env.DB_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME,
};
