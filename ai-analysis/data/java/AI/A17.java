import java.util.*;
import java.io.*;

// AI-style chat server simulation with detailed comments

class Message{
    String user;
    String content;

    Message(String u,String c){
        this.user=u;
        this.content=c;
    }
}

class AIChatServer{
    Map<String,String> users=new HashMap<>();  // username -> password
    Map<Integer,String> sessions=new HashMap<>(); // sessionId -> username
    Map<Integer,List<Message>> inboxes=new HashMap<>(); // sessionId -> messages
    Random rand=new Random();

    void createUsers(){
        // Create multiple users with default passwords
        for(int i=0;i<5;i++){
            users.put("user"+i,"pass"+i);
        }
    }

    int login(String username,String password){
        // Authenticate and create session
        if(users.get(username)!=null && users.get(username).equals(password)){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,username);
            inboxes.put(sid,new ArrayList<>());
            return sid;
        }
        return -1;
    }

    void logout(int sessionId){
        // Logout user and remove inbox
        sessions.remove(sessionId);
        inboxes.remove(sessionId);
    }

    void sendMessage(int sessionId,String msg){
        // Send message to the inbox of the session
        if(sessions.containsKey(sessionId)){
            inboxes.get(sessionId).add(new Message(sessions.get(sessionId),msg));
        }
    }

    List<Message> getInbox(int sessionId){
        // Return all messages for a session
        if(sessions.containsKey(sessionId)){
            return inboxes.get(sessionId);
        }
        return new ArrayList<>();
    }

    void simulateActivity(){
        // Simulate sending multiple messages for each session
        for(int i=0;i<5;i++){
            int sid=login("user"+i,"pass"+i);
            for(int j=0;j<5;j++){
                sendMessage(sid,"Hello "+j+" from sid "+sid);
            }
        }
    }

    void simulateFullWorkflow(){
        // Full workflow: create users, simulate messages, view inbox, clear sessions
        createUsers();
        simulateActivity();
        for(int sid:sessions.keySet()){
            getInbox(sid);
        }
        sessions.clear();
        inboxes.clear();
    }

    void expandSimulation(){
        // Repeat workflow multiple times to reach ~300 lines
        for(int i=0;i<5;i++){
            simulateFullWorkflow();
        }
    }

    public static void main(String[] args){
        AIChatServer server=new AIChatServer();
        server.expandSimulation();
        System.out.println("AI Chat Simulation Completed");
    }
}
