const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const studentController = require("../controllers/studentController");
const { verify } = require("jsonwebtoken");
router.get("/students", authenticateToken, studentController.Get.multipleStudent);
router.get("/students/:id", authenticateToken, studentController.Get.singleStudent);
router.post("/students", authenticateToken, studentController.Post.singleStudent);
router.put("/students/:id", authenticateToken, studentController.Put.singleStudent);
router.delete("/students/:id", authenticateToken, studentController.Delete.singleStudent);


router.post("/login", studentController.Post.loginStudent);
router.post("/register", studentController.Post.registerStudent);
router.get("/verify", studentController.Get.verify);
module.exports = router; 