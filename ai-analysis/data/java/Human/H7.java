import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class TCPServerHuman {

 static int PORT=12345;
 static int POOL=5;

 public static void main(String[] args){
  ExecutorService pool=Executors.newFixedThreadPool(POOL);
  try(ServerSocket server=new ServerSocket(PORT)){
   System.out.println("Server running on "+PORT);
   while(true){
    Socket s=server.accept();
    pool.execute(new ClientHandler(s));
   }
  }catch(IOException e){e.printStackTrace();}
  finally{pool.shutdown();}
 }

 static class ClientHandler implements Runnable{
  Socket sock;
  ClientHandler(Socket s){sock=s;}

  public void run(){
   try(BufferedReader in=new BufferedReader(new InputStreamReader(sock.getInputStream()));
       PrintWriter out=new PrintWriter(sock.getOutputStream(),true)){
    String l;
    while((l=in.readLine())!=null){
     System.out.println("Got: "+l);
     out.println("Echo: "+l); // reply
     if(l.equalsIgnoreCase("bye")) break;
    }
   }catch(IOException e){e.printStackTrace();}
   finally{
    try{
     sock.close();
     System.out.println("Conn closed");
    }catch(IOException e){e.printStackTrace();}
   }
  }
 }
}
