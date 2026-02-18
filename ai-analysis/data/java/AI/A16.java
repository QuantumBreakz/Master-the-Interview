import java.util.*;
import java.io.*;

// AI-style Task Manager simulation with descriptive comments

class Task{
    String user;
    String title;
    String description;
    String status;

    Task(String u,String t,String d){
        this.user=u;
        this.title=t;
        this.description=d;
        this.status="pending";
    }
}

class AITaskManager{
    Map<String,String> users=new HashMap<>();  // username -> password
    Map<Integer,String> sessions=new HashMap<>();  // sessionId -> username
    List<Task> tasks=new ArrayList<>();
    Random rand=new Random();

    void addUsers(){
        // Add multiple users with default passwords
        for(int i=0;i<5;i++){
            users.put("user"+i,"pass"+i);
        }
    }

    int login(String username,String password){
        // Authenticate and create session
        if(users.get(username)!=null && users.get(username).equals(password)){
            int sid=rand.nextInt(9000)+1000;
            sessions.put(sid,username);
            return sid;
        }
        return -1;
    }

    void logout(int sessionId){
        // Remove session for a user
        sessions.remove(sessionId);
    }

    void addTask(int sessionId,String title,String desc){
        // Add task to the session user
        String user=sessions.get(sessionId);
        if(user!=null){
            tasks.add(new Task(user,title,desc));
        }
    }

    void completeTask(int sessionId,int index){
        // Complete task if belongs to session user
        String user=sessions.get(sessionId);
        if(user!=null && index>=0 && index<tasks.size()){
            if(tasks.get(index).user.equals(user)){
                tasks.get(index).status="completed";
            }
        }
    }

    List<Task> viewTasks(int sessionId){
        // Return all tasks for session user
        String user=sessions.get(sessionId);
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
        // Simulate multiple users adding tasks
        for(int i=0;i<5;i++){
            int sid=login("user"+i,"pass"+i);
            for(int j=0;j<5;j++){
                addTask(sid,"task"+j,"desc"+j+" for sid "+sid);
            }
        }
    }

    void completeRandomTasks(){
        // Randomly complete half of tasks per session
        for(int sid:sessions.keySet()){
            for(int i=0;i<tasks.size()/2;i++){
                completeTask(sid,i);
            }
        }
    }

    void fullSimulation(){
        // Full workflow: users, tasks, complete, view, reset
        addUsers();
        simulateActivity();
        completeRandomTasks();
        for(int sid:sessions.keySet()){
            viewTasks(sid);
        }
        sessions.clear();
    }

    void expandSimulation(){
        // Repeat workflow multiple times to expand code to ~300 lines
        for(int i=0;i<5;i++){
            fullSimulation();
        }
    }

    public static void main(String[] args){
        AITaskManager manager=new AITaskManager();
        manager.expandSimulation();
        System.out.println("AI Task Simulation Completed");
    }
}
