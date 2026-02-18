import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.time.LocalDateTime;

public class LogParserHuman {

 static String LOG_DIR="logs/";

 static class LogEntry{
  LocalDateTime ts;
  String lvl;
  String msg;
  LogEntry(LocalDateTime t,String l,String m){ts=t;lvl=l;msg=m;}
  String toCSV(){return ts+","+lvl+","+msg;}
 }

 static LogEntry parseLine(String line){
  try{
   int i=line.indexOf("]");
   String ts=line.substring(1,i);
   LocalDateTime t=LocalDateTime.parse(ts);
   String rest=line.substring(i+2);
   String[] p=rest.split(" - ",2);
   return new LogEntry(t,p[0],p[1]);
  }catch(Exception e){return null;}
 }

 static List<LogEntry> readLogs(String dir){
  List<LogEntry> entries=new ArrayList<>();
  try(DirectoryStream<Path> stream=Files.newDirectoryStream(Paths.get(dir),"*.log")){
   for(Path p:stream){
    List<String> lines=Files.readAllLines(p);
    for(String l:lines){
     LogEntry e=parseLine(l);
     if(e!=null) entries.add(e);
    }
   }
  }catch(IOException e){System.out.println("Error reading logs");}
  return entries;
 }

 static void saveCSV(List<LogEntry> entries,String file){
  try(BufferedWriter w=new BufferedWriter(new FileWriter(file))){
   w.write("Timestamp,Level,Message\n"); // header
   for(LogEntry e:entries){
    w.write(e.toCSV());
    w.newLine();
   }
  }catch(IOException e){e.printStackTrace();}
 }

 public static void main(String[] args){
  List<LogEntry> logs=readLogs(LOG_DIR);
  List<LogEntry> errors=new ArrayList<>();
  for(LogEntry e:logs){
   if(e.lvl.equals("ERROR")) errors.add(e); // only errors
  }
  saveCSV(logs,"all_logs.csv");
  saveCSV(errors,"error_logs.csv");
  System.out.println("Parsed "+logs.size()+" entries, errors: "+errors.size());
 }
}
