const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const cors=require('cors')
mongoose.set('strictQuery',true)

main().catch(err=>console.log(err))

async function main() {
  mongoose.connect('mongodb://localhost:27017/local')
  console.log("DB Connected")
}

const userSchema=new mongoose.Schema({
  name:String,
  price:Number
})

const Fruit=mongoose.model('fruits',userSchema)

const server=express()
server.use(cors())
server.use(bodyParser.json())

server.post('/demo',async(req,res)=>{
  const fruit=new Fruit()
  const keys=Object.keys(req.body)
  for(let i=0;i<keys.length;i++){
    fruit[keys[i]]=req.body[keys[i]]
  }
  const doc=await fruit.save()
  console.log("saved :",doc)
  res.json(doc)
})

server.get('/data',async(req,res)=>{
  const docs=await Fruit.find({})
  res.json(docs)
})

server.listen(8080,()=>{
  console.log("server started at 8080")
})