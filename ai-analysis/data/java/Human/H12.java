import java.util.*;
class Sender{
    int winSize;
    Queue<Integer> win;
    int seqNum;
    
    Sender(int winSize){
        this.winSize=winSize;
        this.win=new ArrayDeque<>(winSize);
        this.seqNum=0;
    }
    void sendPackets(int totalPackets){
        Scanner sc=new Scanner(System.in);
        while(seqNum<totalPackets || !win.isEmpty()){
            while(seqNum<totalPackets && win.size()<winSize){
                win.add(seqNum);
                System.out.println("Sent Packet: "+seqNum++);
            }
            System.out.print("Enter ack for packets or 'exit' to quit:");
            String ack=sc.nextLine().trim();
            if(ack.equalsIgnoreCase("exit")){
                break;
            }
            String[] acks=ack.split(",");
            for (String a : acks){
                int ackNum=Integer.parseInt(a.trim());
                if(win.contains(ackNum)){
                    win.remove(ackNum);
                    System.out.println("Recieved ack for Packet : "+ackNum);
                }
                else{
                    System.out.println("Invalid ack: "+ackNum+" (Not in current window)");
                }
            }
        }
        sc.close();
    }
    public static void main(String[] args){
        int winSize=2;
        int totalpackets=10;
        Sender s=new Sender(winSize);
        s.sendPackets(totalpackets);
        System.out.println("Transmission Completed");
    }
}