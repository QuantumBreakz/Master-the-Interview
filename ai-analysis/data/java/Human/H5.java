import java.util.*;

public class GameSimulationHuman {

 static int MAX=100;
 static int ATTEMPTS=10;

 public static void main(String[] args){
  Scanner sc=new Scanner(System.in);
  Random rand=new Random();

  System.out.println("Number Guess Game");
  int target=rand.nextInt(MAX)+1;
  int tries=0;
  boolean win=false;

  while(tries<ATTEMPTS){
   System.out.print("Guess(1-"+MAX+"): ");
   int g=sc.nextInt(); // user input
   tries++;
   if(g==target){
    System.out.println("You got it in "+tries+" tries!");
    win=true;
    break;
   }
   else if(g<target) System.out.println("Low, try higher");
   else System.out.println("High, try lower");
  }

  if(!win) System.out.println("No luck! Number was "+target);
  System.out.println("End of game");
  sc.close();
 }
}
