const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
// we need to share the data in the json format.
app.use(express.json());

// mongodb connection
const con = require("./db/connection.js");

// using routes
app.use(require("./routes/route"));

con
  .then((db) => {
    // if we dont have the database, exit the process
    if (!db) return process.exit(1);

    // if we have the database.
    // listen to the http server
    app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}`);
    });

    // if above app method have any error
    // this error is from http server
    app.on("error", (err) =>
      console.log(`Failed To Connect with HTTP Server : ${err}`)
    );
  })
  // if there is an error in mongodb connection
  .catch((error) => {
    console.log(`Connection Failed...! ${error}`);
  });
