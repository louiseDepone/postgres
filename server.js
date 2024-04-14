require("dotenv").config();
const { db } = require("./configs/database");

const multer = require("multer");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express"); 

const app = express();
const PORT = 3200;
const HOST = process.env.HOST;
 
const  {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand, 
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} = require( "@aws-sdk/client-s3");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const proBUCKET_NAME = process.env.BUCKET_NAME;
const proBUCKET_REGION = process.env.BUCKET_REGION;
const proBUCKET_ACCESS_KEY_ID = process.env.BUCKET_ACCESS_KEY_ID;
const proBUCKET_SECRET_ACCESS_KEY = process.env.BUCKET_SECRET_ACCESS_KEY;


app.use(cors());
app.use(bodyParser.json());


const S3 = new S3Client({
  
  region:proBUCKET_REGION,
  credentials:{
accessKeyId:proBUCKET_ACCESS_KEY_ID,
secretAccessKey:proBUCKET_SECRET_ACCESS_KEY},
  region:proBUCKET_REGION
})

//GETTING THE POSTTT
app.get("/singePost", async (req, res) => {

  //patrick.png
  
  try{
  const key = "2e561454-1fc7-4303-87f6-1636bfe573f5";
    const params = {
      Bucket: proBUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const seconds = 60;
    const url = await getSignedUrl(S3, command, { expiresIn: seconds });
    console.log(url)
  
    return res.send(url)
  }
  catch(err){
    return res.status(500).json({ message: "Interror" });
  }

})
app.delete("/deletePost", async (req, res) => {
const key ="Official_Registration_Form.pdf"  
const params = {
    Bucket: proBUCKET_NAME,
    Key: key, 
  };
  const command = new DeleteObjectCommand(params);
  await S3.send(command);
  return res.send({});
});
//UPLOADING A POST!!!!!
app.post("/upload", upload.single("name") ,async (req, res) => {
   
  console.log(req.body);
  console.log(req.file); 

  const params = {
    Bucket: proBUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType:req.file.mimetype
  

  }
  const command = new PutObjectCommand(params)

  await S3.send(command)

  res.send({}) 
})
// app.get("/", (req, res) => {
//   console.log("Okay this is the veyr root and onlyfor testing")
//  return res.send("Hello World");
// })

const enrollmentRoute = require("./routes/enrollmentRoute");
const ratingRoute = require("./routes/ratingRoute");
const studentRatingRoute = require("./routes/studentRatingRoute");
const studentRoute = require("./routes/studentRoute"); 
const subjectRoute = require("./routes/subjectRoute");
const teacherRoute = require("./routes/teacherRoute");
const teacherSubjectRoute = require("./routes/teacherSubjectRoute");
const pinpostRoute = require("./routes/pinpostRoute");
const matriculationRoute = require("./routes/matriculationRoute");


app.use("/", 

enrollmentRoute, 
ratingRoute,
 studentRatingRoute,
 studentRoute, 
 subjectRoute,
  teacherRoute, 
  teacherSubjectRoute, 
  pinpostRoute,
  matriculationRoute

);



app.listen(PORT, "0.0.0.0", (err) => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}`);
});
