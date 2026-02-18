import java.util.*;
import java.io.*;

class User{
    String username;
    String password;
    User(String u,String p){
        username=u;
        password=p;
    }
}

class Session{
    int sessionId;
    String username;
    List<String> messages;
    Session(int id,String user){
        sessionId=id;
        username=user;
        messages=new ArrayList<>();
    }
}

class HumanServer{
    Map<String,String> users=new HashMap<>();
    Map<Integer,Session> sessions=new HashMap<>();
    Random rand=new Random();

    void simulateUsers(){
        for(int i=0;i<5;i++){
            users.put("user"+i,"pass"+i);
        }
        for(int i=0;i<5;i++){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,new Session(sid,"user"+i));
        }
    }

    int login(String user,String pass){
        if(users.get(user)!=null && users.get(user).equals(pass)){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,new Session(sid,user));
            return sid;
        }
        return -1;
    }

    void logout(int sid){
        sessions.remove(sid);
    }

    void sendMessage(int sid,String msg){
        if(sessions.containsKey(sid)){
            sessions.get(sid).messages.add(msg);
        }
    }

    List<String> inbox(int sid){
        if(sessions.containsKey(sid)){
            return sessions.get(sid).messages;
        }
        return new ArrayList<>();
    }

    // helper functions to expand code
    void simulateActivity(){
        for(int i=0;i<5;i++){
            for(Integer sid:sessions.keySet()){
                for(int j=0;j<5;j++){
                    sendMessage(sid,"Msg "+j+" session "+sid);
                }
            }
        }
    }

    List<String> listUsers(){
        return new ArrayList<>(users.keySet());
    }

    List<Integer> listSessions(){
        return new ArrayList<>(sessions.keySet());
    }

    void resetSessions(){
        sessions.clear();
    }

    void fullSimulation(){
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
        for(int i=0;i<5;i++){
            fullSimulation();
        }
    }

    public static void main(String[] args){
        HumanServer hs=new HumanServer();
        hs.expandSimulation();
        System.out.println("Simulation Done");
    }
}
