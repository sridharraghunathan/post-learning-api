const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppErrors = require("../utils/appErrors");

exports.userCreate = catchAsync(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({
    email: req.body.email,
    password: password,
  });
  res.status(201).json({
    status: "success",
    message: "successfully created your account",
  });
});

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppErrors("401", "Authentication Failure While Logging!!"));
  }
  try {
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
      return next(
        new AppErrors("401", "Authentication Failure While Logging!!")
      );
    }

    const token = await jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      status: "success",
      message: "Successfully Logged into your account",
      token,
      expiresIn: 3600,
      userId: user._id,
    });
  } catch (err) {
    return next(new AppErrors("401", "Authentication Failure While Logging!!"));
  }
});
