const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const SECRET = process.env.JWT_SECRET_KEY;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      description: "Request does not contain an access token.",
      error: "authorization_required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "The token has expired.",
        error: "token_expired",
      });
    }

    return res.status(401).json({
      message: "Signature verification failed.",
      error: "invalid_token",
    });
  }
};
