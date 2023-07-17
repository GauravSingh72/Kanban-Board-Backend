var jwt = require("jsonwebtoken");
const Auth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    var decoded = jwt.verify(token, "mock15");
    if (req.url === "/board/" && req.method == "POST") {
      req.body.userId = decoded.userId;
    }
    next();
  } catch (error) {
    res.status(400).send({ message: error.message + "Not Authorized" });
  }
};

module.exports = { Auth };
