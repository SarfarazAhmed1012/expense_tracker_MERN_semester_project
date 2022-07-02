const mongoose = require("mongoose");

const conn = mongoose
  .connect(process.env.ATLAS_URI)
  // this function will return a promise,
  // to catch that promise, using below
  .then((db) => {
    console.log("Database Connected");
    return db;
  })
  .catch((err) => {
    console.log("Connection Error");
  });

module.exports = conn;
