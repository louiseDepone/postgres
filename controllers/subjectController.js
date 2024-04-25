const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");
const e = require("express");

// subjects:

// subject_id (INT, Primary Key)
// subject (VARCHAR(50))
// deleted (BOOLEAN)

const subjectController = {
  Get: {
    singleSubject(req, res) { console.log("singleSubject GET")
      const id = req.params.id;
      db.query("SELECT * FROM subjects WHERE subject_id = $1", [subject_id], (err, result) => {
        if (err) { 
          res.status(500).send(err);
          console.log(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    },

    multipleSubject(req, res) { console.log("multipleSubject GET")
      db.query("SELECT * FROM subjects", (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result.rows);
      }
      );
    },
    multipleSubjectOfACertainUser(req, res) { console.log("multipleSubjectOfACertainUser GET")
      const id = req.params.id;
      db.query(
        `
      SELECT DISTINCT sub.subject_id,
    sub.subject
    FROM subjects sub
    JOIN teacher_subjects ts ON sub.subject_id = ts.subject_id
    JOIN enrollments e ON ts.teacher_subject_id = e.teacher_subject_id
    JOIN students s ON e.student_id = s.student_id
    WHERE s.student_id = $1
      `,
        [id],
        (err, result) => {
          if (err) {
        res.status(500).send(err);
          }
          res.status(200).send(result.rows);
        }
      );
    },

    
  },

  Put: {
    async singleSubject(req, res) { console.log("singleSubject PUT")
      const subject_id = req.params.subject_id;
      const { subject } = req.body;
      db.query("UPDATE subjects SET subject = $1 WHERE subject_id = $2", [subject, subject_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    },

    async multipleSubject(req, res) {},
  },

  Post: {
    async singleSubject(req, res) { console.log("singleSubject POST")
      const { subject } = req.body;
      
      if (!subject) {
        return res.status(400).json({
          message: "Subject name is required",
        });
      }
      try {
        
        db.query("INSERT INTO subjects (subject) VALUES ($1)", [subject], (err, result) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(201).send(result.rows);
        });
      } catch (error) {
        res.status(500).send(error);
      }
    },

    async multipleSubject(req, res) {},
  },

  Delete: {
    async singleSubject(req, res) { console.log("singleSubject DELETE")
      const subject_id = req.params.subject_id;
      db.query("UPDATE subjects SET deleted = true WHERE subject_id = $1", [subject_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (result.rows.rowCount > 0) {
        res.status(200).send(result.rows);
          } else {
        res.status(404).send({ message: "Subject not found" });
          }
        }
      });
    },

    async multipleSubject(req, res) {},
  },
};

module.exports = subjectController;