const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPaylaod = validateToken(tokenCookieValue);
      req.user = userPaylaod;
    } catch (error) {}
    return next();
  };
}

module.exports = { checkForAuthenticationCookie };