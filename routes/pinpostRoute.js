const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const pinpostController = require("../controllers/pinpostController");

router.get("/pinposts", authenticateToken, pinpostController.Get.multiplePinpost);
router.get("/pinposts/:id", authenticateToken, pinpostController.Get.singlePinpost);
router.get(
  "/pinposts/user/:id",
  authenticateToken,
  pinpostController.Get.singleUserPinpost
);
router.delete(
  "/pinposts/:rating_id/:student_id",
  authenticateToken,
  pinpostController.Delete.singlePinpost
);
router.post("/pinposts", authenticateToken, pinpostController.Post.singlePinpost);

module.exports = router;