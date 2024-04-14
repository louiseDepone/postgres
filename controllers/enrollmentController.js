const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");


// Enrollments:

// enrollment_id (INT, Primary Key, Auto Increment)
// student_id (INT, Foreign Key referencing student_id in Students table)
// teacher_subject_id (INT, Foreign Key referencing teacher_subject_id in Teacher_Subjects table)
// deleted (BOOLEAN)

const enrollmentController = {
  Get: {
    singleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      console.log("singleEnrollment", enrollment_id)
      const query = `SELECT * FROM enrollments WHERE enrollment_id = $1 AND deleted = false;`;
      db.query(query, [enrollment_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "Enrollment not found",
          });
        }
        return res.status(200).json(result.rows);
      });
    },

    multipleEnrollment(req, res) {
      console.log("multipleEnrollment")
      const query = `SELECT * FROM enrollments WHERE deleted = false;`;
      console.log("yehey")
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        console.log("ohmyyyy", result)
        return res.status(200).json(result.rows);
      }); 
    },

    multipleEnrollementDependingOnTheTeacherSubjectId(req, res) {

      const { id } = req.params;
      console.log("multipleEnrollementDependingOnTheTeacherSubjectId")
      const query = `
SELECT 
  e.enrollment_id, 
  e.student_id, 
  e.teacher_subject_id, 
  e.deleted,
  t.name AS teacher_name,
  s.name AS student_name,
  sub.subject
FROM 
  enrollments e
JOIN 
  teacher_subjects ts ON e.teacher_subject_id = ts.teacher_subject_id
JOIN 
  teachers t ON ts.teacher_id = t.teacher_id
JOIN 
  students s ON e.student_id = s.student_id
JOIN 
  subjects sub ON ts.subject_id = sub.subject_id
WHERE 
  e.teacher_subject_id = $1;
  `;
      db.query(query, [id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
            
          });
        }else{
          
          console.log("dddddd",result)
          return res.status(200).json(result.rows);
        }
      });
    },
    multipleEnrollementDependingOnTheStudentId(req, res) {
      console.log("multipleEnrollementDependingOnTheStudentId")
      const { id } = req.params;
      const query = `
SELECT 
  e.enrollment_id, 
  e.student_id, 
  e.teacher_subject_id, 
  e.deleted,
  t.name AS teacher_name,
  s.name AS student_name,
  sub.subject
FROM 
  enrollments e
JOIN 
  teacher_subjects ts ON e.teacher_subject_id = ts.teacher_subject_id
JOIN 
  teachers t ON ts.teacher_id = t.teacher_id
JOIN 
  students s ON e.student_id = s.student_id
JOIN 
  subjects sub ON ts.subject_id = sub.subject_id
WHERE 
  e.student_id = $1;
  `;
      db.query(query, [id], (err, result) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }else{

          console.log("result: ",result)
         return  res.status(200).json(result.rows);
        }
      });
    }
  },

  Put: {
    async singleEnrollment(req, res) {
      console.log("singleEnrollment Put")
      const { enrollment_id } = req.params;
      const { student_id, teacher_subject_id, deleted } = req.body;
      const query = `UPDATE enrollments SET student_id = $1, teacher_subject_id = $2, deleted = $3 WHERE enrollment_id = $4;`;
      db.query(query, [student_id, teacher_subject_id, deleted, enrollment_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }else{

          return res.status(200).json(result.rows);
        }
      });
    },

    async multipleEnrollment(req, res) {console.log("multipleEnrollment Put")
      const { enrollment_id } = req.params;
      const { student_id, teacher_subject_id, deleted } = req.body;
      const query = `UPDATE enrollments SET student_id = $1, teacher_subject_id = $2, deleted = $3 WHERE enrollment_id = $4;`;
      db.query(query, [student_id, teacher_subject_id, deleted, enrollment_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }else{

          return res.status(200).json(result.rows);
        }
      });
    },
  },

  Post: {
    async singleEnrollment(req, res) { console.log("singleEnrollment Post")
      const { student_id, teacher_subject_id } = req.body;
       if (!student_id || !teacher_subject_id) {
         return res.status(400).json({
           message: "student and complete course are required",
         });
       }
   
      db.query("INSERT INTO enrollments (student_id, teacher_subject_id) VALUES ($1, $2)", [student_id, teacher_subject_id], (err, result) => {
        if (err) {
          console.log("Errror: ",err)
          res.status(500).send(err);
        }else{
          console.log(result)

          res.status(201).send(result);
        }
      });
    },

    async multipleEnrollmentToOneTeacherSubject(req, res) { console.log("multipleEnrollmentToOneTeacherSubject")
      const { student_id, teacher_subject_id } = req.body;
      try {
        for (let i = 0; i < student_id.length; i++) {
          console.log("adding");
          try {
            db.query("INSERT INTO enrollments (student_id, teacher_subject_id) VALUES ($1, $2)", [student_id[i], teacher_subject_id], (err, result) => {
              if (err) {
                res.status(500).send(err);
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log("finished!!");
        res.status(201).send("success");
      } catch (error) {
        console.log(error);
      }
    },
  },

  Delete: {
    async singleEnrollment(req, res) { console.log("singleEnrollment Delete")
      const { enrollment_id } = req.params;
      db.query("UPDATE enrollments SET deleted = true WHERE enrollment_id = $1", [enrollment_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }else{
 
          return res.status(200).send(result.rows);
        }
      });
    },

    async multipleEnrollment(req, res) { console.log("multipleEnrollment Delete")
      const { enrollment_id } = req.params;
      db.query("UPDATE enrollments SET deleted = true WHERE enrollment_id = $1", [enrollment_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }else{

          return res.status(200).send(result.rows);
        }
      });
    },
    async realDeletion(req, res) { console.log("realDeletion")
      const { id } = req.params;
      db.query("DELETE FROM enrollments WHERE enrollment_id = $1", [id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }else{

          console.log(result.rows);
          return res.status(200).send(result.rows);
        }
      });
    }
  },
};

module.exports = enrollmentController;