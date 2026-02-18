package experiment_6;

import java.util.Scanner;

public class BellmanFord {
    private int D[];
    private int num_ver;
    public static final int MAX_VALUE = 999;

    // Constructor to initialize the number of vertices
    public BellmanFord(int num_ver) {
        this.num_ver = num_ver;
        D = new int[num_ver + 1]; 
    }

    // Method to perform Bellman-Ford algorithm
    public void BellmanFordEvaluation(int source, int A[][]) {
        // Step 1: Initialize distances from source to all other vertices
        for (int node = 1; node <= num_ver; node++)
            D[node] = MAX_VALUE;

        D[source] = 0;

        // Step 2: Relax all edges |V| - 1 times (where |V| is the number of vertices)
        for (int node = 1; node <= num_ver - 1; node++) {
            for (int sn = 1; sn <= num_ver; sn++) { 
                for (int dn = 1; dn <= num_ver; dn++) { 
                    if (A[sn][dn] != MAX_VALUE) { 
                        if (D[dn] > D[sn] + A[sn][dn]) 
                            D[dn] = D[sn] + A[sn][dn]; 
                    }
                }
            }
        }

        // Step 3: Check for negative-weight cycles
        for (int sn = 1; sn <= num_ver; sn++) {
            for (int dn = 1; dn <= num_ver; dn++) {
                if (A[sn][dn] != MAX_VALUE) {
                    if (D[dn] > D[sn] + A[sn][dn])
                        System.out.println("The Graph contains negative edge cycle");
                }
            }
        }

        // Step 4: Print the shortest distances from the source to all vertices
        for (int vertex = 1; vertex <= num_ver; vertex++)
            System.out.println("distance of source " + source + " to " + vertex + " is " + D[vertex]);
    }

    // Main method to take input and execute the Bellman-Ford algorithm
    public static void main(String[] args) {
        int num_ver = 0; 
        int source; 

        // Create a Scanner object to take input from the user
        Scanner sc = new Scanner(System.in);

        // Input the number of vertices
        System.out.print("Enter the number of vertices: ");
        num_ver = sc.nextInt();

        // Initialize the adjacency matrix
        int A[][] = new int[num_ver + 1][num_ver + 1]; 

        // Input the adjacency matrix
        System.out.println("Enter the adjacency matrix:-");
        for (int sn = 1; sn <= num_ver; sn++) {
            for (int dn = 1; dn <= num_ver; dn++) {
                A[sn][dn] = sc.nextInt();
                if (sn == dn) { 
                    A[sn][dn] = 0;
                    continue;
                }

                if (A[sn][dn] == 0) 
                    A[sn][dn] = MAX_VALUE;
            }
        }

        // Input the source vertex
        System.out.print("Enter the source vertex: ");
        source = sc.nextInt();

        // Create an instance of the BellmanFord class and run the algorithm
        BellmanFord b = new BellmanFord(num_ver);
        b.BellmanFordEvaluation(source, A);

        // Close the Scanner object
        sc.close();
    }
}
