const express = require("express");
const { RegisterUser, LoginUser } = require("../Controller/user.controller");

const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);


module.exports = { userRouter };
