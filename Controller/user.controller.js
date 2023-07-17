const { UserModel } = require("../Model/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 4;
var jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "Already registered, please login" });
    }

    bcrypt.hash(pass, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }

      const user = new UserModel({ email, pass: hash });
      await user.save();

      return res.status(201).send({ message: "Registration successful" });
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const LoginUser = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    bcrypt.compare(pass, user.pass, async (err, result) => {
      if (err || !result) {
        return res.status(400).send({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user._id }, "mock15");
      return res.status(200).send({ message: "Login successful", token });
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = { RegisterUser, LoginUser };
