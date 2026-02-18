// simple text processing

const fs=require('fs');
const path=require('path');

const DIR='./texts';
const stopWords=new Set(['the','and','is','in','of','to']);

function loadTexts(){
 let texts=[];
 const files=fs.readdirSync(DIR);
 for(const f of files){
  if(f.endsWith('.txt')){
   texts.push(fs.readFileSync(path.join(DIR,f),'utf-8'));
  }
 }
 return texts;
}

function cleanText(txt){
 return txt.toLowerCase().replace(/[^\w\s]/g,' ').trim();
}

function tokenize(txt){
 return txt.split(/\s+/);
}

function removeStops(tokens){
 return tokens.filter(t=>!stopWords.has(t));
}

function countWords(tokens){
 const freq={};
 for(const t of tokens){
  freq[t]=(freq[t]||0)+1;
 }
 return freq;
}

// main
function main(){
 const texts=loadTexts();
 let global={};

 for(const t of texts){
  let tok=tokenize(cleanText(t));
  tok=removeStops(tok);
  const f=countWords(tok);
  for(const w in f){
   global[w]=(global[w]||0)+f[w];
  }
 }

 // show top 20 words
 const top=Object.entries(global).sort((a,b)=>b[1]-a[1]).slice(0,20);
 console.log("Top words:");
 top.forEach(([w,c])=>console.logw+": "+c);
}

main();
