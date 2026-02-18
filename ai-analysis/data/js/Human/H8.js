// human-style file upload
// minimal comments

const express=require('express');
const multer=require('multer');
const path=require('path');
const app=express();
const PORT=3000;

const storage=multer.diskStorage({
 destination:'./uploads',
 filename:(req,file,cb)=>{cb(null,Date.now()+path.extname(file.originalname));}
});

const upload=multer({
 storage,
 limits:{fileSize:5*1024*1024},
 fileFilter:(req,file,cb)=>{
  const ext=path.extname(file.originalname).toLowerCase();
  if(ext=='.png'||ext=='.jpg'||ext=='.jpeg') cb(null,true);
  else cb(new Error('Only images'));
 }
});

app.post('/upload',upload.single('image'),(req,res)=>{
 res.json({filename:req.file.filename,path:req.file.path});
});

app.listen(PORT,()=>console.log("Server "+PORT));
