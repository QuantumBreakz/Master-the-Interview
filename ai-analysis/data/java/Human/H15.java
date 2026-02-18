import java.util.*;
import java.io.*;

class Post{
    String user;
    String title;
    String content;
    Post(String u,String t,String c){
        user=u;
        title=t;
        content=c;
    }
}

class HumanBlogServer{
    Map<String,String> users=new HashMap<>();
    Map<Integer,String> sessions=new HashMap<>();
    List<Post> posts=new ArrayList<>();
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
            return sid;
        }
        return -1;
    }

    void logout(int sid){
        sessions.remove(sid);
    }

    void addPost(int sid,String title,String content){
        String user=sessions.get(sid);
        if(user!=null){
            posts.add(new Post(user,title,content));
        }
    }

    List<Post> viewPosts(int sid){
        String user=sessions.get(sid);
        List<Post> uPosts=new ArrayList<>();
        if(user!=null){
            for(Post p:posts){
                if(p.user.equals(user)){
                    uPosts.add(p);
                }
            }
        }
        return uPosts;
    }

    void deletePost(int sid,int idx){
        String user=sessions.get(sid);
        if(user!=null && idx>=0 && idx<posts.size()){
            if(posts.get(idx).user.equals(user)){
                posts.remove(idx);
            }
        }
    }

    void simulateActivity(){
        for(int i=0;i<5;i++){
            int sid=login("user"+i,"pass"+i);
            for(int j=0;j<5;j++){
                addPost(sid,"title"+j,"content"+j+" for sid "+sid);
            }
        }
    }

    void fullSimulation(){
        createUsers();
        simulateActivity();
        for(Integer sid:sessions.keySet()){
            viewPosts(sid);
        }
        for(int i=0;i<posts.size();i++){
            deletePost(sessions.keySet().iterator().next(),i);
        }
        sessions.clear();
    }

    void expandSimulation(){
        for(int i=0;i<5;i++){
            fullSimulation();
        }
    }

    public static void main(String[] args){
        HumanBlogServer hbs=new HumanBlogServer();
        hbs.expandSimulation();
        System.out.println("Human Blog Simulation Done");
    }
}
