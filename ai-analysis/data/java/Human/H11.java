import java.util.Scanner;
//class
public class BellmanFord{
    private int D[];
    private int numver;
    public static final int MAX=999;
    public BellmanFord(int numver){
        this.numver=numver;
        D=new int[numver+1];
    }
    //BellmanFord Algorithm
    public void Evaluation(int src, int A[][]){
        for(int node=1;node<=numver;node++)
            D[node]=MAX;
        D[src]=0;
        for(int node=1;node<=numver-1;node++){
            for(int sn=1;sn<=numver;sn++){
                for(int dn=1;dn<=numver;dn++){
                    if(A[sn][dn]!=MAX){
                        if(D[dn]>D[sn]+A[sn][dn])
                            D[dn]=D[sn]+A[sn][dn];
                    }
                }
            }
        }
        for(int sn=1;sn<=numver;sn++){
            for(int dn=1;dn<=numver;dn++){
                if(A[sn][dn]!=MAX){
                    if(D[dn]>D[sn]+A[sn][dn])
                        System.out.println("The Graph contains neagtive edge cycles");
                }
            }
        }
        for(int ver=1;ver<=numver;ver++)
            System.out.println("Distance of Source "+src+" -> "+ver+" is "+D[ver]);
    }
    //Main Function
    public static void main(String[] args){
        int numver=0;
        int src;
        Scanner sc=new Scanner(System.in);
        System.out.print("Enter the number of vertices :");
        numver=sc.nextInt();
        int A[][]=new int[numver+1][numver+1];
        System.out.println("Ennter the adjacncy matrix :");
        for(int sn=1;sn<=numver;sn++){
            for(int dn=1;dn<=numver;dn++){
                A[sn][dn]=sc.nextInt();
                if(sn==dn){
                    A[sn][dn]=0;
                    continue;
                }
                if(A[sn][dn]==0){
                    A[sn][dn]=MAX;
                }
            }
        }
        System.out.print("Enter the Source Vertex :");
        src=sc.nextInt();
        BellmanFord b=new BellmanFord(numver);
        b.Evaluation(src,A);
        sc.close();
    }
}