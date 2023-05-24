const express = require("express");
const {
  deactivatedUser,
  activeUser,
  updateUser,
  getAllUsers,
  getUserById,
  addUser,
} = require("../controllers/userController");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");

// /api/users
router.get("/", verifyTokenAndAdmin, getAllUsers);
router.put("/",verifyToken, updateUser);
router.patch("/:id/deactivate",verifyTokenAndAuthorization, deactivatedUser);
router.patch("/:id/active",verifyTokenAndAuthorization, activeUser);
router.post("/",verifyTokenAndAuthorization, addUser);

// /api/users/:id
router
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserById);

module.exports = router;
