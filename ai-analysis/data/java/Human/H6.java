import java.util.*;

public class GraphTraversalHuman {

 Map<String,List<String>> g=new HashMap<>();

 void addEdge(String u,String v){
  g.computeIfAbsent(u,k->new ArrayList<>()).add(v);
  g.computeIfAbsent(v,k->new ArrayList<>()).add(u);
 }

 List<String> bfs(String start){
  List<String> order=new ArrayList<>();
  Set<String> visited=new HashSet<>();
  Queue<String> q=new LinkedList<>();
  q.add(start);
  while(!q.isEmpty()){
   String n=q.poll();
   if(!visited.contains(n)){
    visited.add(n);
    order.add(n);
    for(String nei:g.getOrDefault(n,new ArrayList<>())){
     if(!visited.contains(nei)) q.add(nei);
    }
   }
  }
  return order;
 }

 List<String> dfs(String start){
  List<String> order=new ArrayList<>();
  Set<String> visited=new HashSet<>();
  Stack<String> stack=new Stack<>();
  stack.push(start);
  while(!stack.isEmpty()){
   String n=stack.pop();
   if(!visited.contains(n)){
    visited.add(n);
    order.add(n);
    List<String> neis=g.getOrDefault(n,new ArrayList<>());
    Collections.reverse(neis);
    for(String nei:neis){
     if(!visited.contains(nei)) stack.push(nei);
    }
   }
  }
  return order;
 }

 public static void main(String[] args){
  GraphTraversalHuman gr=new GraphTraversalHuman();
  gr.addEdge("A","B");
  gr.addEdge("A","C");
  gr.addEdge("B","D");
  gr.addEdge("B","E");
  gr.addEdge("C","F");
  gr.addEdge("E","F");

  System.out.println("BFS "+gr.bfs("A"));
  System.out.println("DFS "+gr.dfs("A"));
 }
}
