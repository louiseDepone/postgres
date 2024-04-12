const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// Student_Ratings:

// rating_id (INT, Primary Key, Auto Increment)
// student_id (INT, Foreign Key referencing student_id in Students table)
// rating_value (INT)
// comment (TEXT)
// date (DATE)
// approved (BOOLEAN)
// deleted (BOOLEAN)

const studentRatingController = {
  Get: {
    singleStudentRating(req, res) { console.log("singleStudentRating GET")
      const { rating_id } = req.params;
      const query = `SELECT * FROM student_ratings WHERE rating_id = $1 AND deleted = false;`;
      db.query(query, [rating_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "Student_Rating not found",
          });
        }
        res.status(200).json(result.rows);
      });
    },

    multipleStudentRating(req, res) { console.log("multipleStudentRating GET")
      const query = `SELECT * FROM student_ratings WHERE deleted = false;`;
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "Student_Rating not found",
          });
        }
        res.status(200).json(result.rows);
      });
    },
  },

  Put: {
    async singleStudentRating(req, res) { console.log("singleStudentRating PUT")
      const { rating_id } = req.params;
      const { student_id, rating_value, comment, date, approved, deleted } = req.body;
      const query = `UPDATE student_ratings SET student_id = $1, rating_value = $2, comment = $3, date = $4, approved = $5, deleted = $6 WHERE rating_id = $7;`;
      db.query(query, [student_id, rating_value, comment, date, approved, deleted, rating_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result.rows);
      });
    },

    async multipleStudentRating(req, res) {},
  },

  Post: {
    async singleStudentRating(req, res) { console.log("singleStudentRating POST")
      const { student_id, rating_value, comment, date, approved, deleted } = req.body;
      const query = `INSERT INTO student_ratings (student_id, rating_value, comment, date, approved, deleted) VALUES ($1, $2, $3, $4, $5, $6);`;
      db.query(query, [student_id, rating_value, comment, date, approved, deleted], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(201).json(result.rows);
      });
    },

    async multipleStudentRating(req, res) {},
  },
  Delete: {
    async singleStudentRating(req, res) { console.log("singleStudentRating DELETE")
      const { rating_id } = req.params;
      const query = `UPDATE student_ratings SET deleted = true WHERE rating_id = $1;`;
      db.query(query, [rating_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result.rows);
      });
    },

    async multipleStudentRating(req, res) {},
  },
};

module.exports = studentRatingController;