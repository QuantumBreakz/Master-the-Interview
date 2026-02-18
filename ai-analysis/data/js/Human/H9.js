// human-style cron tasks
// minimal comments

const cron=require('node-cron');

cron.schedule('*/5 * * * * *',()=>{
 console.log(new Date().toISOString()+" Task1");
});

cron.schedule('*/10 * * * * *',()=>{
 console.log(new Date().toISOString()+" Task2");
});

cron.schedule('* * * * *',()=>{
 console.log(new Date().toISOString()+" Task3");
});

console.log("Cron jobs started");
