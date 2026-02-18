// human-style Express server
// minimal comments

const express=require('express');
const app=express();
const PORT=3000;

app.use(express.json());

let users=[{id:1,name:'Alice'},{id:2,name:'Bob'}];

app.get('/users',(req,res)=>{
 res.json(users);
});

app.get('/users/:id',(req,res)=>{
 const u=users.find(u=>u.id==req.params.id);
 if(u) res.json(u);
 else res.status(404).json({error:'Not found'});
});

app.post('/users',(req,res)=>{
 const {name}=req.body;
 if(!name) return res.status(400).json({error:'Name required'});
 const n={id:Date.now(),name};
 users.push(n);
 res.status(201).json(n);
});

app.put('/users/:id',(req,res)=>{
 const u=users.find(u=>u.id==req.params.id);
 if(!u) return res.status(404).json({error:'Not found'});
 if(req.body.name) u.name=req.body.name;
 res.json(u);
});

app.delete('/users/:id',(req,res)=>{
 const i=users.findIndex(u=>u.id==req.params.id);
 if(i==-1) return res.status(404).json({error:'Not found'});
 const r=users.splice(i,1);
 res.json(r[0]);
});

app.listen(PORT,()=>console.log("Server running "+PORT));
