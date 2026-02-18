import java.util.*;
import java.io.*;

// AI-style server simulation
// Users, sessions, messages, and full workflow with descriptive comments

class User{
    String username;
    String password;
    User(String u,String p){
        this.username=u;
        this.password=p;
    }
}

class Session{
    int sessionId;
    String username;
    List<String> messages;
    Session(int id,String user){
        this.sessionId=id;
        this.username=user;
        this.messages=new ArrayList<>();
    }
}

class AIServer{
    Map<String,String> users=new HashMap<>();  // username -> password
    Map<Integer,Session> sessions=new HashMap<>(); // sessionId -> Session
    Random rand=new Random();

    void simulateUsers(){
        // Initialize multiple users with passwords
        for(int i=0;i<5;i++){
            users.put("user"+i,"pass"+i);
        }
        // Create sessions for these users
        for(int i=0;i<5;i++){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,new Session(sid,"user"+i));
        }
    }

    int login(String username,String password){
        // Authenticate and create session
        if(users.get(username)!=null && users.get(username).equals(password)){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,new Session(sid,username));
            return sid;
        }
        return -1;
    }

    void logout(int sessionId){
        // Remove session
        sessions.remove(sessionId);
    }

    void sendMessage(int sessionId,String msg){
        // Send a message for the session user
        if(sessions.containsKey(sessionId)){
            sessions.get(sessionId).messages.add(msg);
        }
    }

    List<String> inbox(int sessionId){
        // Retrieve all messages for the session
        if(sessions.containsKey(sessionId)){
            return sessions.get(sessionId).messages;
        }
        return new ArrayList<>();
    }

    void simulateActivity(){
        // Add multiple messages for each session to expand workflow
        for(int i=0;i<5;i++){
            for(Integer sid:sessions.keySet()){
                for(int j=0;j<5;j++){
                    sendMessage(sid,"Message "+j+" for session "+sid);
                }
            }
        }
    }

    List<String> listUsers(){
        // List all registered users
        return new ArrayList<>(users.keySet());
    }

    List<Integer> listSessions(){
        // List all active session IDs
        return new ArrayList<>(sessions.keySet());
    }

    void resetSessions(){
        // Clear all active sessions
        sessions.clear();
    }

    void simulateFullWorkflow(){
        // Complete workflow: init, activity, listing, reset, repeat
        simulateUsers();
        simulateActivity();
        listUsers();
        listSessions();
        resetSessions();
        simulateUsers();
        simulateActivity();
        listSessions();
        listUsers();
        simulateActivity();
        resetSessions();
    }

    void expandSimulation(){
        // Repeat full workflow multiple times to expand code
        for(int i=0;i<5;i++){
            simulateFullWorkflow();
        }
    }

    public static void main(String[] args){
        AIServer server=new AIServer();
        server.expandSimulation();
        System.out.println("AI Simulation Completed");
    }
}
