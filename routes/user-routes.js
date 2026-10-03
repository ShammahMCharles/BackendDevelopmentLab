const express = require("express");
const router = express.Router();
const authController = require("../controllers/user-controller");
const verifyAuthentication = require("../middleware/verifyAuthentication.js");
const adminOnly = require("../middleware/adminOnly");

// You could use this line to apply a middleware to every defined route in your router if you wanted
// router.use(verifyAuthentication);

router.get("/", verifyAuthentication, authController.getUser);
router.get("/admin", verifyAuthentication, adminOnly, authController.getUser);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;