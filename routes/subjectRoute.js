const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const subjectController = require("../controllers/subjectController");


router.get("/subjects", authenticateToken, subjectController.Get.multipleSubject);
router.get("/subjects/:id", authenticateToken, subjectController.Get.singleSubject);
router.get(
  "/multipleSubjectOfACertainUser/:id",
  authenticateToken,
  subjectController.Get.multipleSubjectOfACertainUser
);
router.post("/subjects", authenticateToken, subjectController.Post.singleSubject);
router.put("/subjects/:id", authenticateToken, subjectController.Put.singleSubject);
router.delete("/subjects/:id", authenticateToken, subjectController.Delete.singleSubject);

module.exports = router;