// human-style logging
// minimal comments, practical spacing

const fs=require('fs');
const path=require('path');
const DIR='./logs';

function readLogs(){
 let logs=[];
 const files=fs.readdirSync(DIR);
 for(const f of files){
  if(f.endsWith('.log')){
   const content=fs.readFileSync(path.join(DIR,f),'utf-8');
   const lines=content.split(/\r?\n/);
   for(const l of lines){
    const log=parseLine(l);
    if(log) logs.push(log);
   }
  }
 }
 return logs;
}

// parse single line
function parseLine(line){
 const m=line.match(/\[(.*?)\] (\w+) - (.*)/);
 if(!m) return null;
 return {timestamp:m[1],level:m[2],message:m[3]};
}

// save logs
function saveJSON(data,file){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
 console.log("Saved "+data.length+" entries to "+file);
}

// main
function main(){
 const logs=readLogs();
 const errors=logs.filter(l=>l.level==='ERROR');
 saveJSON(logs,'all_logs.json');
 saveJSON(errors,'error_logs.json');
 console.log("Processed "+logs.length+" logs, "+errors.length+" errors");
}

main();
