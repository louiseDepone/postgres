const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const studentRatingController = require("../controllers/studentRatingController");

router.get("/studentRatings", authenticateToken, studentRatingController.Get.multipleStudentRating);
router.get("/studentRatings/:id", authenticateToken, studentRatingController.Get.singleStudentRating);
router.post("/studentRatings", authenticateToken, studentRatingController.Post.singleStudentRating);
router.put("/studentRatings/:id", authenticateToken, studentRatingController.Put.singleStudentRating);
router.delete("/studentRatings/:id", authenticateToken, studentRatingController.Delete.singleStudentRating);


module.exports = router;