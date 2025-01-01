// NPM Pacakages
const bcrypt = require("bcrypt");

//Models
const User = require("../models/User");

//Schema
const { signupSchema, loginSchema } = require("../schema/User");

// Utils
const genrateToken = require("../utils/GenrateToken");
/**
 * @desciption Signup User
 * @route POST /api/user/signup
 * @access Public
 */
module.exports.signup = async (req, res) => {
  const payload = req.body;

  //Error Handling
  const result = signupSchema(payload);
  if (result.error) {
    const errors = result.error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: false,
      msg: errors,
    });
  }

  try {
    // Checking if user already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        msg: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    //Creating user
    await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      profileImg: payload.profileImg,
    });

    //Response
    return res.status(201).json({
      status: true,
      msg: "User Registered Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      errors: error.message,
    });
  }
};

/**
 * @desciption login user
 * @route POST /api/user/login
 * @access Public
 */
module.exports.login = async (req, res) => {
  const payload = req.body;

  //Error Handling
  const result = loginSchema(payload);
  if (result.error) {
    const errors = result.error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: false,
      msg: errors,
    });
  }

  try {
    //Checking valid user
    const validUser = await User.findOne({ email: payload.email }).select(
      "password"
    );
    if (!validUser) {
      return res.status(401).json({
        status: false,
        msg: "Email or Password is incorrect",
      });
    }

    //Checking password
    const validPassword = await bcrypt.compareSync(
      payload.password,
      validUser.password
    );
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        msg: "Email or Password is incorrect",
      });
    }

    const token = genrateToken(validUser._id);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
      })
      .json({
        status: true,
        message: "User Logged In Successfully!",
        id: validUser._id,
        token,
      });
  } catch (error) {
    return res.status(500).json({
      errors: error.message,
    });
  }
};
