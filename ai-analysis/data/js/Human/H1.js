// human-written web scraping
// minimal comments, realistic spacing

const axios=require('axios');
const cheerio=require('cheerio');
const fs=require('fs');

const urls=['https://example.com/page1','https://example.com/page2','https://example.com/page3'];

async function getHTML(url){
 let data=null;
 try{
  const res=await axios.get(url);
  data=res.data;
 }catch(e){console.log("Error "+url);}
 return data;
}

function parse(html){
 const $=cheerio.load(html);
 let products=[];
 $('div.product').each((i,e)=>{
  const t=$(e).find('h2').text();
  const p=$(e).find('span.price').text();
  const l=$(e).find('a').attr('href');
  products.push({title:t,price:p,link:l});
 });
 return products;
}

function save(data,file){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
 console.log("Saved "+data.length+" items to "+file);
}

(async ()=>{
 let all=[];
 for(const u of urls){
  const html=await getHTML(u);
  if(html) all=all.concat(parse(html));
 }
 save(all,'products.json');
})();
