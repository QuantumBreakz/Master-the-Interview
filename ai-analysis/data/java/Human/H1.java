import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.opencsv.CSVWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class WebScraperHuman {

 static String[] urls={"https://example.com/page1","https://example.com/page2","https://example.com/page3"};

 static class Item{
  String title;
  String price;
  String link;
  Item(String t,String p,String l){
   title=t;
   price=p;
   link=l;
  }
  String[] toArr(){return new String[]{title,price,link};}
 }

 static List<Item> parsePage(String url){
  List<Item> items=new ArrayList<>();
  try{
   Document doc=Jsoup.connect(url).get();
   Elements elems=doc.select("div.item");
   for(Element e:elems){
    String t=e.select("h2").text();
    String p=e.select("span.price").text();
    String l=e.select("a[href]").attr("href");
    items.add(new Item(t,p,l));
   }
  }catch(IOException ex){
   System.out.println("Fail "+url);
  }
  return items;
 }

 static void writeCSV(List<Item> all,String file){
  try(CSVWriter writer=new CSVWriter(new FileWriter(file))){
   writer.writeNext(new String[]{"Title","Price","Link"}); // header
   for(Item i:all) writer.writeNext(i.toArr());
  }catch(IOException e){e.printStackTrace();}
 }

 public static void main(String[] args){
  List<Item> all=new ArrayList<>();
  for(String u:urls){
   List<Item> items=parsePage(u);
   all.addAll(items);
  }
  writeCSV(all,"scraped_data.csv");
  System.out.println("Done, total items: "+all.size());
 }
}
