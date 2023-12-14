const asyncHandler = require("express-async-handler");
// bcrypt is used to encrypt passwords
const bcrypt = require("bcrypt");
// User model is imported from the models folder
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Contact = require("../models/userModel");

// @desc Register a user
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("email already exists");
  }
  // Hash the password with salt
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("HashedPassword is :", hashedPassword);
  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });
  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Error creating user");
  }
  res.json({ message: "register the user" });
});

// @desc Login user
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  //   Compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "40m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

// @desc current user
// @route POST /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
