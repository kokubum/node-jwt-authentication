const app = require("./app");
const config = require("./config");

const port = config.PORT || 3000;

// Running the database connection
require("./db/database");
// Running the redis connection
require("./db/blacklist");

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
