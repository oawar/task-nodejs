const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser,validateAddUser } = require("../models/User");

/**
 *  @desc    Add User
 *  @route   /api/v1/users/:id
 *  @method  POST
 *  @access  private (user himself)
 */
module.exports.updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }


  let checkEmail = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user.id }
  });
  if (checkEmail) {
    return res.status(400).json({message:"this email already exist"});
  }
  let checkUsername = await User.findOne({
    username: req.body.username,
    _id: { $ne: req.user.id }
  });
  if (checkUsername) {
    return res.status(400).json({ message: "this username already exist" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      },
    },
    { new: true }
  ).select(["-password","-isAdmin"]);



  res.status(200).json(updatedUser);
});

/**
 *  @desc    Update User
 *  @route   /api/v1/users/:id
 *  @method  PUT
 *  @access  private (user himself)
 */
module.exports.addUser = asyncHandler(async (req, res) => {
  const { error } = validateAddUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) {
    return res.status(400).json({ message: "this email already exist" });
  }
  let checkUsername = await User.findOne({ username: req.body.username });
  if (checkUsername) {
    return res.status(400).json({ message: "this username already exist" });
  }


  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  const result = await user.save();

  const { password,isAdmin, ...other } = result._doc;

  res.status(201).json({ ...other });

});



/**
 *  @desc    Get All Users
 *  @route   /api/v1/users
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({isAdmin:{$nin : true}}).select(["-password","-isAdmin"]);
  res.status(200).json(users);
});

/**
 *  @desc    Get User By Id
 *  @route   /api/v1/users/:id
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(["-password","-isAdmin"]);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

/**
 *  @desc    Get User By Id
 *  @route   /api/v1/users/:id
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(["-password","-isAdmin"]);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

/**
 *  @desc    deactivated user
 *  @route   /api/v1/users/:id/deactivate
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.deactivatedUser = asyncHandler(async (req, res) => {
  const deactivatedUser = await User.findByIdAndUpdate(
  req.user.id,
      {
        $set: {
          isActive: false,
        },
      },
      { new: true }
).select(["-password","-isAdmin"]);
  res.status(200).json(deactivatedUser);
});

/**
 *  @desc    active user
 *  @route   /api/v1/users/:id/active
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.activeUser = asyncHandler(async (req, res) => {
  const activeUser = await User.findByIdAndUpdate(
  req.user.id,
      {
        $set: {
          isActive: true,
        },
      },
      { new: true }
).select(["-password","-isAdmin"]);
  res.status(200).json(activeUser);
});

