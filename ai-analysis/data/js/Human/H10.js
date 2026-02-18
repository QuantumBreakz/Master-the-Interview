// human-style encryption/hash
// minimal comments

const crypto=require('crypto');

function encrypt(text,key){
 const c=crypto.createCipheriv('aes-128-cbc',Buffer.from(key),Buffer.alloc(16,0));
 let e=c.update(text,'utf8','hex');
 e+=c.final('hex');
 return e;
}

function decrypt(enc,key){
 const d=crypto.createDecipheriv('aes-128-cbc',Buffer.from(key),Buffer.alloc(16,0));
 let dec=d.update(enc,'hex','utf8');
 dec+=d.final('utf8');
 return dec;
}

function hash(text){
 return crypto.createHash('sha256').update(text).digest('hex');
}

const key=crypto.randomBytes(16);
const msg="Secret message";

const enc=encrypt(msg,key);
console.log("Enc:",enc);

const dec=decrypt(enc,key);
console.log("Dec:",dec);

console.log("Hash:",hash(msg));
