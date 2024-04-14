const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const matriculationController = require("../controllers/matriculationController");

router.get(
  "/matriculation",
  authenticateToken,
  matriculationController.Get.multipleMatriculation
);
router.get(
  "/matriculation/:id",
  authenticateToken,
  matriculationController.Get.singleMatriculation
);
router.post(
  "/ddddddddddddAddingmatriculation/:student_id",
  authenticateToken,
  upload.single("pdf_name_matriculation"),
  matriculationController.Post.singleMatriculation
);
router.put(
  "/matriculation/:id",
  authenticateToken,
  matriculationController.Put.singleMatriculation
);
router.put(
  "/singleMtriculationApproval/:id",
  authenticateToken,
  matriculationController.Put.singleMatriculation
);
// router.delete(
//   "/matriculation/:id",
//   authenticateToken,
//   matriculationController.Delete.singleMatriculation
// );

module.exports = router;
