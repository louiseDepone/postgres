const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// ratings:
// -- CREATE TABLE ratings (
// --   rating_id INT PRIMARY KEY AUTO_INCREMENT,
// --   student_id INT,
// --   teacher_subject_id INT,
// --   rating_value INT,
// --   comment TEXT,
// --   date DATE,
// --   approved BOOLEAN DEFAULT FALSE,
// --   deleted BOOLEAN DEFAULT FALSE,
// --   FOREIGN KEY (student_id) REFERENCES students(student_id),
// --   FOREIGN KEY (teacher_subject_id) REFERENCES teacher_subjects(teacher_subject_id)
// -- );

const publicEndpointsController = {
  Get: {
    multipleRating(req, res) {
      console.log("multipleRating GET");
      db.query(
        `SELECT
        ratings.rating_id,
        ratings.student_id,
        students.name AS studentName,
        teachers.name AS teacherName,
        teachers.teacher_id,
        subjects.subject AS subjectName,
        subjects.subject_id ,
        ratings.comment,
        ratings.teaching_method,
        ratings.attitude,
        ratings.communication,
        ratings.organization,
        ratings.supportiveness,
        ratings.engagement,
        ratings.likes,
        ratings.dislikes,
        ratings.date,
        ratings.approved,
        ratings.deleted
        

      FROM
        ratings
        INNER JOIN students ON ratings.student_id = students.student_id
        INNER JOIN teacher_subjects ON ratings.teacher_subject_id = teacher_subjects.teacher_subject_id
        INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
        INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id
        WHERE ratings.deleted = false AND ratings.approved = true
        order by ratings.rating_id desc
        ;`,
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while fetching the ratings" });
          } else {
            console.log(result.rows);
            res.status(200).json(result.rows);
          }
        }
      );
    },
    multipleRatingOnAcertainSubject(req, res) {
        console.log("multipleRatingOnAcertainSubject GET");
       const  { subject_id } = req.params;
      console.log("multipleRating GET");
      db.query(
        `SELECT
        ratings.rating_id,
        ratings.student_id,
        students.name AS studentName,
        teachers.name AS teacherName,
        teachers.teacher_id,
        subjects.subject AS subjectName,
        subjects.subject_id ,
        ratings.comment,
        ratings.teaching_method,
        ratings.attitude,
        ratings.communication,
        ratings.organization,
        ratings.supportiveness,
        ratings.engagement,
        ratings.likes,
        ratings.dislikes,
        ratings.date,
        ratings.approved,
        ratings.deleted
        

      FROM
        ratings
        INNER JOIN students ON ratings.student_id = students.student_id
        INNER JOIN teacher_subjects ON ratings.teacher_subject_id = teacher_subjects.teacher_subject_id
        INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
        INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id
        order by ratings.rating_id desc
        WHERE subjects.subject_id = $1 AND ratings.deleted = false AND ratings.approved = true
        ;` , [subject_id],
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while fetching the ratings" });
          } else {
            console.log(result.rows);
            res.status(200).json(result.rows);
          }
        }
      );
    },
    multipleRatingOnAcertainTeacher(req, res) {
        console.log("multipleRatingOnAcertainTeacher GET");
       const  { teacher_id } = req.params;
      console.log("multipleRating GET");
      db.query(
        `SELECT
        ratings.rating_id,
        ratings.student_id,
        students.name AS studentName,
        teachers.name AS teacherName,
        teachers.teacher_id,
        subjects.subject AS subjectName,
        subjects.subject_id ,
        ratings.comment,
        ratings.teaching_method,
        ratings.attitude,
        ratings.communication,
        ratings.organization,
        ratings.supportiveness,
        ratings.engagement,
        ratings.likes,
        ratings.dislikes,
        ratings.date,
        ratings.approved,
        ratings.deleted
        

      FROM
        ratings
        INNER JOIN students ON ratings.student_id = students.student_id
        INNER JOIN teacher_subjects ON ratings.teacher_subject_id = teacher_subjects.teacher_subject_id
        INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
        INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id
        order by ratings.rating_id desc
         WHERE teachers.teacher_id = $1 AND ratings.deleted = false AND ratings.approved = true
        ;` , [teacher_id], 
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while fetching the ratings" });
          } else {
            console.log(result.rows);
            res.status(200).json(result.rows);
          }
        }
      );
    },
  },
};

module.exports = publicEndpointsController;
