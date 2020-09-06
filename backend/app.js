const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const multer = require("multer");
const Post = require("./models/postModel");
const mongoose = require("mongoose");
const postRouter = require("./routes/postsRoute");
const userRouter = require("./routes/usersRoute");
const globalController = require("./controller/errorController");
const dbConnection = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Database Connection to MongoDB
mongoose
  .connect(
    dbConnection,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connection to MongoDB established succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Cross Orgin resource sharing
app.use(cors());
// Parsing the JSON REQUEST
app.use(express.json());
// Allowing the complex request
app.options("*", cors());
// to serve the static files and we can uses images
app.use("/images", express.static(path.join("backend/images")));

//Creating the Multer function for the file Upload function
const MimeType = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use(globalController);

module.exports = app;
