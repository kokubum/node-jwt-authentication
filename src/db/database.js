const mongoose = require("mongoose");
const config = require("../config");

const databaseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

let databaseUri;
if (config.DB_URI) {
  const auxiliarUri = config.DB_URI;
  databaseUri = auxiliarUri.replace(/<username>|<password>/g, (matched) => {
    return matched === "<username>" ? config.DB_USER : config.DB_PASSWORD;
  });
} else {
  databaseUri = `mongodb://localhost:27017/authentication-jwt`;
}

mongoose
  .connect(databaseUri, databaseOptions)
  .then((conn) => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(`Error with mongo connection: ${err.code}`);
  });
