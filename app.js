require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

/**importing file */
const userRoute = require("./routes/user");
const blogRouter = require("./routes/blog");
const { connectDB } = require("./connectiondb");
const { checkForAuthenticationCookie } = require("./middleware/authetication");
const Blog = require("./modal/blog");

const app = express();
const PORT = process.env.PORT || 8003;

/**connect with database i.e., mongodb
 * export MONGO_URL=mongodb://127.0.0.1:27017/blog-project
 */
connectDB(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connected successfully");
});

/**ejs setup */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/**middleware */
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

/**app routes */
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({})?.sort({ createdAt: -1 });
  // console.log(allBlogs);
  res.render("Home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on Port : ${PORT}`);
});
