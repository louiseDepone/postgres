const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");


// Teachers:

// teacher_id (INT, Primary Key)
// name (VARCHAR(50))
// email (VARCHAR(100))
// deleted (BOOLEAN)

const teacherContoller = {
  Get: {
    singleTeacher(req, res) { console.log("singleTeacher, GET")
      const teacher_id = req.params.teacher_id;
      db.query("SELECT * FROM teachers WHERE teacher_id = $1", [teacher_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    },
    mutliplesTeacherOfACertainUser(req, res) {  console.log("mutliplesTeacherOfACertainUser, GET")
      const id = req.params.id;
      db.query(
        `SELECT t.teacher_id, t.name AS teacher_name, COUNT(DISTINCT t.teacher_id) AS teacher_count
    FROM teachers t
    JOIN teacher_subjects ts ON t.teacher_id = ts.teacher_id
    JOIN enrollments e ON ts.teacher_subject_id = e.teacher_subject_id
    JOIN students s ON e.student_id = s.student_id
    WHERE s.student_id = $1
    GROUP BY t.teacher_id, t.name;`,
        [id],
        (err, result) => {
          if (err) {
        res.status(500).send(err);
          } else {
        res.status(200).send(result.rows);
          }
        }
      );
    },

    multipleTeacher(req, res) { console.log("multipleTeacher, GET")
      db.query("SELECT * FROM teachers", (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result.rows);
      }
      );
    },
  },

  Put: {
    async singleTeacher(req, res) { console.log("singleTeacher, PUT")
      const teacher_id = req.params.id;   
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ message: "teacher name is required" });

      db.query("UPDATE teachers SET name = $1 WHERE teacher_id = $2", [name, teacher_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    },

    async multipleTeacher(req, res) { console.log("multipleTeacher, PUT")
      const teacher_id = req.params.teacher_id;
      const { name } = req.body;
      
      if (!name)
        return res.status(400).json({ message: "teacher name is required" });

      db.query("UPDATE teachers SET name = $1 WHERE teacher_id = $3", [name,  teacher_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    },
  },

  Post: {
    async singleTeacher(req, res) { console.log("singleTeacher, POST")
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "teacher name is required" });

      try {
        
        db.query("INSERT INTO teachers (name) VALUES ($1)", [name], (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(201).send(result.rows);
          }
        });
      } catch (error) {
        console.log(error)
      }
    },

    async multipleTeacher(req, res) {},
  },

  Delete: {
    async singleTeacher(req, res) { console.log("singleTeacher, DELETE")
      const teacher_id = req.params.teacher_id;
      db.query("UPDATE teachers SET deleted = true WHERE teacher_id = $1", [teacher_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    },

    async multipleTeacher(req, res) {},
  },
};
 
module.exports = teacherContoller;