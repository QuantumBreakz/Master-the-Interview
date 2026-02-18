import java.io.*;
import java.net.*;
import org.json.JSONArray;
import org.json.JSONObject;

public class APIClientHuman {

 String[] urls={"https://api.example.com/users","https://api.example.com/orders","https://api.example.com/products"};

 public JSONArray fetchJSON(String urlStr){
  JSONArray arr=null;
  try{
   URL url=new URL(urlStr);
   HttpURLConnection conn=(HttpURLConnection)url.openConnection();
   conn.setRequestMethod("GET");
   BufferedReader in=new BufferedReader(new InputStreamReader(conn.getInputStream()));
   String line;
   StringBuilder content=new StringBuilder();
   while((line=in.readLine())!=null){
    content.append(line);
   }
   in.close();
   conn.disconnect();
   arr=new JSONArray(content.toString());
  }catch(Exception e){System.out.println("Error "+urlStr);}
  return arr;
 }

 public void saveCSV(JSONArray arr,String file){
  try(FileWriter w=new FileWriter(file)){
   if(arr.length()>0){
    JSONObject f=arr.getJSONObject(0);
    String h=String.join(",",f.keySet());
    w.write(h+"\n"); // header
    for(int i=0;i<arr.length();i++){
     JSONObject o=arr.getJSONObject(i);
     StringBuilder l=new StringBuilder();
     for(String k:f.keySet()){
      l.append(o.optString(k)).append(",");
     }
     l.deleteCharAt(l.length()-1);
     w.write(l.toString()+"\n");
    }
   }
  }catch(IOException e){e.printStackTrace();}
 }

 public static void main(String[] args){
  APIClientHuman api=new APIClientHuman();
  for(String u:api.urls){
   JSONArray data=api.fetchJSON(u);
   if(data!=null){
    String fname=u.substring(u.lastIndexOf("/")+1)+".csv";
    api.saveCSV(data,fname);
    System.out.println("Saved "+fname+" "+data.length()+" rows");
   }
  }
 }
}
