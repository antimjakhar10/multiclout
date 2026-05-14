const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  createAdmin,
} = require("../controllers/adminAuthController");

router.post("/login", loginAdmin);
router.get("/create-admin", createAdmin);

module.exports = router;