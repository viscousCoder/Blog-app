const express = require("express");

const User = require("../modal/user");

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  //   console.log(req.body, "hii");
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });

  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    //   console.log(token);
    return res.cookie("token", token).redirect("/");
    // if (!token) return res.redirect("/signin");
  } catch (error) {
    return res.render("signin", { error: "Incorrect Email or password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
