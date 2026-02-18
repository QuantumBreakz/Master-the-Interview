import java.util.*;
import java.io.*;

class Message{
    String user;
    String content;
    Message(String u,String c){
        user=u;
        content=c;
    }
}

class HumanChatServer{
    Map<String,String> users=new HashMap<>();
    Map<Integer,String> sessions=new HashMap<>();
    Map<Integer,List<Message>> inboxes=new HashMap<>();
    Random rand=new Random();

    void createUsers(){
        for(int i=0;i<5;i++){
            users.put("user"+i,"pass"+i);
        }
    }

    int login(String user,String pass){
        if(users.get(user)!=null && users.get(user).equals(pass)){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,user);
            inboxes.put(sid,new ArrayList<>());
            return sid;
        }
        return -1;
    }

    void logout(int sid){
        sessions.remove(sid);
        inboxes.remove(sid);
    }

    void sendMessage(int sid,String msg){
        if(sessions.containsKey(sid)){
            inboxes.get(sid).add(new Message(sessions.get(sid),msg));
        }
    }

    List<Message> getInbox(int sid){
        if(sessions.containsKey(sid)){
            return inboxes.get(sid);
        }
        return new ArrayList<>();
    }

    void simulateActivity(){
        for(int i=0;i<5;i++){
            int sid=login("user"+i,"pass"+i);
            for(int j=0;j<5;j++){
                sendMessage(sid,"Hello "+j+" from sid "+sid);
            }
        }
    }

    void simulateFullWorkflow(){
        createUsers();
        simulateActivity();
        for(int sid:sessions.keySet()){
            getInbox(sid);
        }
        sessions.clear();
        inboxes.clear();
    }

    void expandSimulation(){
        for(int i=0;i<5;i++){
            simulateFullWorkflow();
        }
    }

    public static void main(String[] args){
        HumanChatServer hcs=new HumanChatServer();
        hcs.expandSimulation();
        System.out.println("Human Chat Simulation Done");
    }
}
