import java.util.*;

/**
 * AI-generated graph traversal example
 * Demonstrates BFS and DFS with adjacency list representation
 */
public class GraphTraversalAI {

    static class Graph {
        Map<String, List<String>> adjList = new HashMap<>();

        // Add edge between nodes
        void addEdge(String u, String v) {
            adjList.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            adjList.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
        }

        // Breadth-first search
        List<String> bfs(String start) {
            List<String> order = new ArrayList<>();
            Set<String> visited = new HashSet<>();
            Queue<String> queue = new LinkedList<>();
            queue.add(start);

            while (!queue.isEmpty()) {
                String node = queue.poll();
                if (!visited.contains(node)) {
                    visited.add(node);
                    order.add(node);
                    for (String neighbor : adjList.getOrDefault(node, new ArrayList<>())) {
                        if (!visited.contains(neighbor)) queue.add(neighbor);
                    }
                }
            }
            return order;
        }

        // Depth-first search
        List<String> dfs(String start) {
            List<String> order = new ArrayList<>();
            Set<String> visited = new HashSet<>();
            Stack<String> stack = new Stack<>();
            stack.push(start);

            while (!stack.isEmpty()) {
                String node = stack.pop();
                if (!visited.contains(node)) {
                    visited.add(node);
                    order.add(node);
                    List<String> neighbors = adjList.getOrDefault(node, new ArrayList<>());
                    Collections.reverse(neighbors); // keep order consistent
                    for (String neighbor : neighbors) {
                        if (!visited.contains(neighbor)) stack.push(neighbor);
                    }
                }
            }
            return order;
        }
    }

    public static void main(String[] args) {
        Graph g = new Graph();
        g.addEdge("A", "B");
        g.addEdge("A", "C");
        g.addEdge("B", "D");
        g.addEdge("B", "E");
        g.addEdge("C", "F");
        g.addEdge("E", "F");

        System.out.println("BFS order: " + g.bfs("A"));
        System.out.println("DFS order: " + g.dfs("A"));
    }
}
