const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");
const { v4: uuidv4 } = require("uuid");

const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");




const proBUCKET_NAME = process.env.BUCKET_NAME;
const proBUCKET_REGION = process.env.BUCKET_REGION;
const proBUCKET_ACCESS_KEY_ID = process.env.BUCKET_ACCESS_KEY_ID;
const proBUCKET_SECRET_ACCESS_KEY = process.env.BUCKET_SECRET_ACCESS_KEY;

const S3 = new S3Client({
  
  region:proBUCKET_REGION,
  credentials:{
accessKeyId:proBUCKET_ACCESS_KEY_ID,
secretAccessKey:proBUCKET_SECRET_ACCESS_KEY},
  region:proBUCKET_REGION
})


// id - integer
// student_id - integer
// pdf_name_matriculation - character varying
// deleted - boolean
// approved -boolean
// ADD COLUMN s3name VARCHAR(255) ;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const matriculationController = {
  Get: {
    async singleMatriculation(req, res) {
      const { id } = req.params;
          const query = `SELECT * FROM matriculations_submition WHERE student_id = $1 ;`;
          db.query(query, [id], async (err, result) => {
            try {
              if (err) {
                return res.status(500).json({
                  message: "Internal Server Error",
                });
              }
              if (result.rows.length === 0) {
                return res.status(201).json({
                  message: "Matriculation not found",
                });
              }

             
                for (let i = 0; i < result.rows.length; i++) {
                  try {
                    const key = result.rows[i].s3name;
                    const params = {
                      Bucket: proBUCKET_NAME,
                      Key: key,
                    };
                    const command = new GetObjectCommand(params);
                    const seconds = 60;

                    const url = await getSignedUrl(S3, command, {
                      expiresIn: seconds,
                    })
                    
                    result.rows[i].s3name = url;
                  
                  } catch (error) {
                    console.log(error);
                  }
                
              }
               await  res.status(200).json(result.rows);
            } catch (error) {
              console.log(error);
            }
          });
    },

    multipleMatriculation(req, res) {
      console.log("multipleMatriculation")
      const query = `SELECT * FROM matriculation WHERE deleted = false;`;
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
  },

  Post: {
    async singleMatriculation(req, res) {
      try {
        const { student_id } = req.params;
        console.log(req.params);
        const {file_name} = req.body;
        const pdf_name_matriculation = uuidv4();

    // console.log(pdf_name_matriculation);
    // return
          const params = {
            Bucket: proBUCKET_NAME,
            Key: pdf_name_matriculation,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          };
         

        const checkExistingMatriculation = async (student_id, file_name) => {
          const query = `SELECT * FROM matriculations_submition WHERE student_id = $1 AND pdf_name_matriculation = $2;`;
          const result = await db.query(query, [student_id, file_name]);
          return result.rows.length > 0;
        };

        const isExistingMatriculation = await checkExistingMatriculation(student_id, file_name);
        if (isExistingMatriculation) {
          console.log("already exisiting namr!")
            return res.status(201).json("Matriculation already exists");
        }
        const command = new PutObjectCommand(params);

        await S3.send(command);
        console.log("uploaded");
        const query = `INSERT INTO matriculations_submition (student_id, pdf_name_matriculation, s3name, type) VALUES ($1, $2, $3,$4) ;`;
        db.query(
          query,
          [student_id, file_name, pdf_name_matriculation, req.file.mimetype],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: "Internal Server Error",
              });
            }
            return res.status(201).json(result.rows);
          }
        );
        console.log("sadsd")
      } catch (error) {
        console.log(error)
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
    },
  },

  Put: {
    singleMatriculation(req, res) {
      const { id } = req.params;
      const { student_id } = req.body;
      const query = `UPDATE matriculation SET student_id = $1 WHERE id = $2  ;`;
      db.query(query, [student_id, id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "Matriculation not found",
          });
        }
        return res.status(200).json(result.rows);
      })
    },
    singleMtriculationApproval(req, res) {
      const { id } = req.params;
      const { approved } = req.body;
      const query = `UPDATE matriculation SET approved = $1 WHERE id = $2  ;`;
      db.query(query, [approved, id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "Matriculation not found",
          });
        }
        return res.status(200).json(result.rows);
      })
    }
  }
}
module.exports = matriculationController