const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
mongoose.set('strictQuery',true)

main().catch(err=>console.log(err))

async function main() {
  mongoose.connect('mongodb://localhost:27017/local')
  console.log("db connected")
}

const userSchema=mongoose.Schema({
  uname:String,
  pass:String
})

const User=mongoose.model('users',userSchema)

const server=express()
server.use(cors())
server.use(bodyParser.json())

server.post('/demo',async(req,res)=>{
  const username=req.body.uname,password=req.body.pass
  const docs=await User.findOne({uname: username})
  if(docs){
    if(password===docs.pass)
      res.json("Login Success")
    else
      res.json("Invalid UserName or Password")
  }
  else
      res.json("Invalid UserName or Password")
})

server.listen(8080,()=>{
  console.log('Server started')
})