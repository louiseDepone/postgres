const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const teacherController = require("../controllers/teacherController");


router.get("/teachers", teacherController.Get.multipleTeacher);
router.get("/teachers/:id", authenticateToken, teacherController.Get.singleTeacher);
router.get(
  "/mutliplesTeacherOfACertainUser/:id",
  authenticateToken,
  teacherController.Get.mutliplesTeacherOfACertainUser
);
router.post("/teachers", authenticateToken, teacherController.Post.singleTeacher);
router.put("/teachers/:id", authenticateToken, teacherController.Put.singleTeacher);
router.delete("/teachers/:id", authenticateToken, teacherController.Delete.singleTeacher);

module.exports = router;