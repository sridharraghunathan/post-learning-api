const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

const authCheck = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodeToken = await jwt.verify(token, process.env.JWT_TOKEN);
  if (!decodeToken.email || !decodeToken.id) {
    return next(
      new AppErrors("401", "Authentication Failed, since Token is not valid")
    );
  }
  req.userData = { email: decodeToken.email, userId: decodeToken.id };
  next();
});

module.exports = authCheck;
