const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// Students:

// student_id (INT, Primary Key)
// name (VARCHAR(50))
// email (VARCHAR(100))
// password (VARCHAR(100))
// approved (BOOLEAN)
// deleted (BOOLEAN)
// role (VARCHAR(20), Default: 'student')
const studentController = {
  Get: {
    async verify(req, res) {
      console.log("verify, GET");
      const decoded = decoding(req);
      console.log(decoded);
      res.status(201).json(decoded);
    },

    singleStudent(req, res) {
      console.log("singleStudent, GET");
      const student_id = req.params.id;
      const query = `SELECT * FROM students WHERE student_id = $1`;
      db.query(query, [student_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
          } else {
            res.status(404).json({ message: "Student Not Found" });
          }
        }
      });
    },
    multipleStudent(req, res) {
      console.log("multipleStudent, GET");
      const query = `SELECT * FROM students`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.status(200).json(result.rows);
        }
      });
    },
  },

  Put: {
    async singleStudent(req, res) {
      console.log("singleStudent, PUT");
      const student_id = req.params.id;
      console.log(req.params.id);
      const { name, email, password } = req.body;
      // const hashedPassword = password;
      // hashung the password
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      const query = `UPDATE students SET name = $1, email = $2, password = $3 WHERE student_id = $4`;
      db.query(
        query,
        [name, email, hashedPassword, student_id],
        (err, result) => {
          try {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "Server Error" });
            } else {
              if (result.rows.affectedRows > 0) {
                res.status(200).json({ message: "Student Updated" });
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      );
    },

    async multipleStudent(req, res) {},
  },

  Post: {
    async singleStudent(req, res) {},
    registerStudent(req, res) {
      console.log("registering student");
      let continueRegister = false;
      let { name, email, password, student_id, role } = req.body;

      if (!name || !email || !password || !student_id) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

      const querys = `SELECT * FROM students WHERE email = $1`;

      db.query(querys, [email], async (err, result) => {
        console.log("checking email");
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Internal Server Error",
            err,
          });
        } else {
          if (result.rows.length > 0) {
            continueRegister = false;
            console.log("have email");
            return res
              .status(409)
              .json({ message: "Student Email Already in use" });
          } else {
            const queryss = `SELECT * FROM students WHERE student_id = $1`;

            db.query(queryss, [student_id], async (err, result) => {
              console.log("checking student_id");
              if (err) {
                return res.status(500).json({
                  message: "Internal Server Error",
                  err,
                });
              } else {
                if (result.rows.length > 0) {
                  continueRegister = false;
                  console.log("have sdent id");
                  return res
                    .status(409)
                    .json({ message: "Student ID Already in use" });
                } else {
                  console.log("continueRegister");
                  console.log(continueRegister);
                  const query = `INSERT INTO students (name, email, password, role, student_id) VALUES ($1, $2, $3, $4, $5)`;
                  if (!role) {
                    role = "student";
                  }
                  try {
                    db.query(
                      query,
                      [name, email, hashedPassword, role, student_id],
                      async (err, result) => {
                        try {
                          if (err) {
                            return res.status(500).json({
                              message: "Internal Server Error",
                              err,
                            });
                          } else {
                            return res
                              .status(201)
                              .json({ message: "Student Registered" });
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            });
          }
        }
      });

      // if (continueRegister) {
      // } else {
      //   console.log("cancel!", continueRegister);
      // }
    },
    async multipleStudent(req, res) {},
    async loginStudent(req, res) {
      console.log("loginStudent, POST");
      const { email, password } = req.body;
      console.log(req.body);
      const query = `SELECT * FROM students WHERE email = $1`;
      db.query(query, [email], (err, result) => {
        
        if (err) {
          res.status(500).json({ message: "Server Error" });
        } else {
          if (result.rows.length === 0) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
          }
          console.log(result.rows, "dddddddddddddd");
          try {
            const isPasswordCorrect = bcrypt.compareSync(
              password,
              result.rows[0]?.password
            );
            if (isPasswordCorrect) {
              const token = jsonwebtoken.sign(
                {
                  id: result.rows[0].student_id,
                  role: result.rows[0].role,
                  name: result.rows[0].name,
                  email: result.rows[0].email,
                },
                process.env.JWT_SECRET
              );
              console.log("Login Successful");
              res.status(200).json({ message: "Login Successful", token });
            } else {
              console.log("invaliedd!!!");
              res.status(401).json({ message: "Invalid Credentials" });
            }
          } catch (error) {
            console.log("isPasswordCorrect");
            console.log(error);
            res.status(401).json({ message: "Invalid Credentials" });
          }
        }
      });
    },
  },
  Delete: {
    async singleStudent(req, res) {
      console.log("singleStudent, DELETE");
      // this is a soft delete      const student_id = req.params.student_id;
      const query = `UPDATE students SET deleted = true WHERE student_id = $1`;
      db.query(query, [student_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          if (result.rows.affectedRows > 0) {
            res.status(200).json({ message: "Student Deleted" });
          } else {
            res.status(404).json({ message: "Student Not Found" });
          }
        }
      });
    },

    async multipleStudent(req, res) {},
  },
};

module.exports = studentController;
