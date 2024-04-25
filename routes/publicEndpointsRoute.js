
const express = require("express");
const router = express.Router();

const publicEndpointsController = require("../controllers/publicEndpointsController");

router.get("/publicEndpoints", publicEndpointsController.Get.multipleRating);
router.get("/multipleRatingOnAcertainSubject/:subject_id",  publicEndpointsController.Get.multipleRatingOnAcertainSubject);
router.get("/multipleRatingOnAcertainTeacher/:teacher_id",  publicEndpointsController.Get.multipleRatingOnAcertainTeacher);


// router.get("/ratings", authenticateToken, ratingController.Get.multipleRating);

module.exports = router; 