const redis = require("redis");

const redisBlacklist = redis.createClient();

redisBlacklist.on("connect", () => {
  console.log("Redis connection successful");
});

redisBlacklist.on("error", (err) => {
  console.log(`Error with redis connection: ${err.code}`);
});

module.exports = redisBlacklist;
