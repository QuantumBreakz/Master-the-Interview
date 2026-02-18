// human-style async tasks
// minimal comments

function asyncTask(n,d){
 console.log("Start "+n);
 return new Promise(res=>{
  setTimeout(()=>{
   console.log("Done "+n);
   res(n);
  },d);
 });
}

async function main(){
 console.log("Sequential tasks");
 await asyncTask('A',1000);
 await asyncTask('B',1500);
 await asyncTask('C',500);

 console.log("Parallel tasks");
 await Promise.all([
  asyncTask('X',1000),
  asyncTask('Y',1500),
  asyncTask('Z',500)
 ]);
 console.log("Done all");
}

main();
