const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");


const enrollmentController = require("../controllers/enrollmentController");

router.get(
  "/enrollment",
  authenticateToken,
  enrollmentController.Get.multipleEnrollment
);
router.get(
  "/multipleEnrollementDependingOnTheTeacherSubjectId/:id",
  authenticateToken,
  enrollmentController.Get.multipleEnrollementDependingOnTheTeacherSubjectId
);
router.get(
  "/multipleEnrollementDependingOnTheStudentId/:id",
  authenticateToken,
  enrollmentController.Get.multipleEnrollementDependingOnTheStudentId
);
router.post(
  "/enrollment",
  authenticateToken,
  enrollmentController.Post.singleEnrollment
);
router.post(
  "/Multipleenrollment",
  authenticateToken,
  enrollmentController.Post.multipleEnrollmentToOneTeacherSubject
);
router.get(
  "/enrollment/:id",
  authenticateToken,
  enrollmentController.Get.singleEnrollment
);
router.put(
  "/enrollment/:id",
  authenticateToken,
  enrollmentController.Put.singleEnrollment
);
// router.delete(
//   "/enrollment/:id",
//   authenticateToken,
//   enrollmentController.Delete.singleEnrollment
// );
router.delete(
  "/realDeletion/:id",
  authenticateToken,
  enrollmentController.Delete.realDeletion
);




module.exports = router;