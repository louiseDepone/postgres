const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const teacherSubjectController = require("../controllers/teacherSubjectController");
router.get("/teacherSubjects", authenticateToken, teacherSubjectController.Get.multipleTeacherSubject);
router.get("/teacherSubjects/:id", authenticateToken, teacherSubjectController.Get.singleTeacherSubject);
router.get("/studentteackingcourses",authenticateToken,teacherSubjectController.Get.emrolledsubjects);
router.get(
  "/teacherSubjects/user/:id",
  authenticateToken,
  teacherSubjectController.Get.singleUserTeacherSubject
);
router.post("/teacherSubjects", authenticateToken, teacherSubjectController.Post.singleTeacherSubject);
router.put("/teacherSubjects/:id", authenticateToken, teacherSubjectController.Put.singleTeacherSubject);
router.put("/teacherSubjectsDelete/:id", authenticateToken, teacherSubjectController.Delete.singleTeacherSubject);

module.exports = router;