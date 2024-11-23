const express = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../modal/blog");
const Comment = require("../modal/comment");

const router = express.Router();

/**handle multer  */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    return cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/addblog", (req, res) => {
  return res.render("addblog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({
    blogId: req.params.id,
  }).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

/**comments route */
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
