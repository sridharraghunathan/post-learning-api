const express = require("express");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const postController = require("../controller/postController");
const authCheck = require("../middleware/authCheck");

//Creating the Multer function for the file Upload function

router.post("", authCheck, fileUpload, postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.patch("/:id", authCheck, fileUpload, postController.updatePost);
router.delete("/:id", authCheck, postController.deletePost);

module.exports = router;
