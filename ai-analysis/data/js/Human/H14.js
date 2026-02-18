const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const mongoose =require('mongoose')
mongoose.set('strictQuery',true)

async function main() {
    mongoose.connect('mongodb://localhost:27017/local')
    console.log('MongoDB Connected')
}

main()

const userSchema=mongoose.Schema({
    uname:String,
    pass:String
})

const User=mongoose.model('user',userSchema)

const server=express()
server.use(cors())
server.use(bodyParser.json())

server.post('/demo',async(req,res)=>{
    const {uname, pass}=req.body
    const doc=await User.findOne({uname})
    if(doc){
        if(doc.pass===pass)
        {
            res.json("Login Success")
        }
        else{
            res.json("Invlaid User Name or password")
        }
    }else{
        res.json("Invlaid User Name or password")
    }
    res.json(doc)
})

server.listen(8080,()=>{
    console.log('server started at 8080')
})