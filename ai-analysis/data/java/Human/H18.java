import java.util.*;
import java.io.*;

class Product{
    String name;
    double price;
    int stock;
    Product(String n,double p,int s){
        name=n;
        price=p;
        stock=s;
    }
}

class HumanECommerceServer{
    Map<String,String> users=new HashMap<>();
    Map<Integer,String> sessions=new HashMap<>();
    List<Product> products=new ArrayList<>();
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

    void addProduct(String name,double price,int stock){
        products.add(new Product(name,price,stock));
    }

    void buyProduct(int sid,int idx){
        if(sessions.containsKey(sid) && idx>=0 && idx<products.size()){
            Product p=products.get(idx);
            if(p.stock>0){
                p.stock--;
            }
        }
    }

    List<Product> viewProducts(int sid){
        if(sessions.containsKey(sid)){
            return products;
        }
        return new ArrayList<>();
    }

    void simulateActivity(){
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
        createUsers();
        simulateActivity();
        for(int sid:sessions.keySet()){
            viewProducts(sid);
        }
        sessions.clear();
        products.clear();
    }

    void expandSimulation(){
        for(int i=0;i<5;i++){
            fullSimulation();
        }
    }

    public static void main(String[] args){
        HumanECommerceServer hes=new HumanECommerceServer();
        hes.expandSimulation();
        System.out.println("Human E-Commerce Simulation Done");
    }
}
