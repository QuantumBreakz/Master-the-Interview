import java.io.*;
import java.nio.file.*;
import java.util.*;

public class TextProcessingHuman {

 String folder="texts/";

 static Set<String> stopWords=new HashSet<>(Arrays.asList("the","and","is","in","of","to"));

 public List<String> loadTexts() {
  List<String> texts=new ArrayList<>();
  try(DirectoryStream<Path> stream=Files.newDirectoryStream(Paths.get(folder),"*.txt")){
   for(Path p:stream){
    String content=new String(Files.readAllBytes(p));
    texts.add(content);
   }
  }catch(IOException e){System.out.println("Error loading files");}
  return texts;
 }

 public String cleanText(String txt){
  return txt.toLowerCase().replaceAll("\\p{Punct}"," ").trim();
 }

 public List<String> tokenize(String txt){
  return Arrays.asList(txt.split("\\s+"));
 }

 public List<String> removeStops(List<String> tokens){
  List<String> res=new ArrayList<>();
  for(String t:tokens){
   if(!stopWords.contains(t)) res.add(t);
  }
  return res;
 }

 public Map<String,Integer> countWords(List<String> tokens){
  Map<String,Integer> freq=new HashMap<>();
  for(String t:tokens){
   freq.put(t,freq.getOrDefault(t,0)+1);
  }
  return freq;
 }

 public static void main(String[] args){
  TextProcessingHuman tp=new TextProcessingHuman();
  List<String> texts=tp.loadTexts();
  Map<String,Integer> global=new HashMap<>();
  for(String t:texts){
   List<String> tokens=tp.tokenize(tp.cleanText(t));
   tokens=tp.removeStops(tokens);
   Map<String,Integer> freq=tp.countWords(tokens);
   for(Map.Entry<String,Integer> e:freq.entrySet()){
    global.put(e.getKey(),global.getOrDefault(e.getKey(),0)+e.getValue());
   }
  }
  global.entrySet().stream()
    .sorted((a,b)->b.getValue()-a.getValue())
    .limit(20)
    .forEach(e->System.out.println(e.getKey()+": "+e.getValue()));
 }
}
