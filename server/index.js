import express from "express";
import{Pool} from "pg";
import multer from "multer";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config(;
const app = express(;
const port = process.env.PORT || 5000;

//Postgress connection
const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl:{rejectUnauthorized:false}
});

//AWS S3 config
const s3 = new AWS.S3({
  accessKeyld:process.env.AWS_ACCESS_KEY,
  secrecAccessKey:process.env.AWs_SECRET_KEY,
  region:process.env.AWS_REGION
});

/*Multer config( store in memory before uploading to S3)*/
const upload = multer({storage:
  mu;ter.memoryStorage( });

//Upload API
app.post("/upload",uplload.single("file"), async (req, res) => {
  const file = req.file;
  
const s3Params = {
  Bucket:process.env.S3_BUCKET,
  Key:Date.now() + "_" +file.originalname,
  Body:file.buffer
};

  try{
    const data = await s3.upload(s3Params).promise();
    await pol.query("INSERT INTO file(name, url) VALUES($1, $2)",[
      file.originalname,
      data.Location
      ]);
    res.json({success:true,url:data.Loaction});
  } catch (err) {
    res.status(500).json({error:err.message }):
  }
});

//List files
app.get("/files",async (req, res)=> {
  const result = await pool.query("SELECT * FROM files ORDER BY id DESC");
  res.json(result.rows);
});

app.lesten(port. () => {console.log(`server running on port $[port]`);
});


