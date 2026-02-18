import java.util.*;
import java.io.*;

class Task{
    String user;
    String title;
    String description;
    String status;
    Task(String u,String t,String d){
        user=u;
        title=t;
        description=d;
        status="pending";
    }
}

class HumanTaskManager{
    Map<String,String> users=new HashMap<>();
    Map<Integer,String> sessions=new HashMap<>();
    List<Task> tasks=new ArrayList<>();
    Random rand=new Random();

    void addUsers(){
        for(int i=0;i<5;i++){
            users.put("user"+i,"pass"+i);
        }
    }

    int login(String user,String pass){
        if(users.get(user)!=null && users.get(user).equals(pass)){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,user);
            return sid;
        }
        return -1;
    }

    void logout(int sid){
        sessions.remove(sid);
    }

    void addTask(int sid,String title,String desc){
        String user=sessions.get(sid);
        if(user!=null){
            tasks.add(new Task(user,title,desc));
        }
    }

    void completeTask(int sid,int idx){
        String user=sessions.get(sid);
        if(user!=null && idx>=0 && idx<tasks.size()){
            if(tasks.get(idx).user.equals(user)){
                tasks.get(idx).status="completed";
            }
        }
    }

    List<Task> viewTasks(int sid){
        String user=sessions.get(sid);
        List<Task> uTasks=new ArrayList<>();
        if(user!=null){
            for(Task t:tasks){
                if(t.user.equals(user)){
                    uTasks.add(t);
                }
            }
        }
        return uTasks;
    }

    void simulateActivity(){
        for(int i=0;i<5;i++){
            int sid=login("user"+i,"pass"+i);
            for(int j=0;j<5;j++){
                addTask(sid,"task"+j,"desc"+j+" for sid "+sid);
            }
        }
    }

    void completeRandomTasks(){
        for(int sid:sessions.keySet()){
            for(int i=0;i<tasks.size()/2;i++){
                completeTask(sid,i);
            }
        }
    }

    void fullSimulation(){
        addUsers();
        simulateActivity();
        completeRandomTasks();
        for(int sid:sessions.keySet()){
            viewTasks(sid);
        }
        sessions.clear();
    }

    void expandSimulation(){
        for(int i=0;i<5;i++){
            fullSimulation();
        }
    }

    public static void main(String[] args){
        HumanTaskManager htm=new HumanTaskManager();
        htm.expandSimulation();
        System.out.println("Human Task Simulation Done");
    }
}
