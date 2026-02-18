import java.util.*;
import java.io.*;

// AI-style E-Commerce simulation with full descriptive comments

class Product{
    String name;
    double price;
    int stock;

    Product(String n,double p,int s){
        this.name=n;
        this.price=p;
        this.stock=s;
    }
}

class AIECommerceServer{
    Map<String,String> users=new HashMap<>(); // username -> password
    Map<Integer,String> sessions=new HashMap<>(); // sessionId -> username
    List<Product> products=new ArrayList<>();
    Random rand=new Random();

    void createUsers(){
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
        // Logout session
        sessions.remove(sessionId);
    }

    void addProduct(String name,double price,int stock){
        // Add product to catalog
        products.add(new Product(name,price,stock));
    }

    void buyProduct(int sessionId,int index){
        // Buy a product if in stock and session exists
        if(sessions.containsKey(sessionId) && index>=0 && index<products.size()){
            Product p=products.get(index);
            if(p.stock>0){
                p.stock--;
            }
        }
    }

    List<Product> viewProducts(int sessionId){
        // Return list of products for session
        if(sessions.containsKey(sessionId)){
            return products;
        }
        return new ArrayList<>();
    }

    void simulateActivity(){
        // Simulate user logins, product addition, and purchases
        for(int i=0;i<5;i++){
            int sid=login("user"+i,"pass"+i);
            for(int j=0;j<5;j++){
                addProduct("prod"+j,10.0+j,5+j);
            }
            for(int j=0;j<5;j++){
                buyProduct(sid,j);
            }
        }
    }

    void fullSimulation(){
        // Full workflow: create users, simulate activity, view, reset
        createUsers();
        simulateActivity();
        for(int sid:sessions.keySet()){
            viewProducts(sid);
        }
        sessions.clear();
        products.clear();
    }

    void expandSimulation(){
        // Repeat workflow multiple times to reach ~300 lines
        for(int i=0;i<5;i++){
            fullSimulation();
        }
    }

    public static void main(String[] args){
        AIECommerceServer server=new AIECommerceServer();
        server.expandSimulation();
        System.out.println("AI E-Commerce Simulation Completed");
    }
}
