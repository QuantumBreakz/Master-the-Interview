import java.io.*;
import java.util.*;
import java.util.Queue;
import java.util.ArrayDeque;

class Sender {
    int windowSize;
    Queue<Integer> window;
    int sequenceNumber;

    Sender(int windowSize) {
        this.windowSize = windowSize;
        this.window = new ArrayDeque<>(windowSize);
        this.sequenceNumber = 0;
    }

    void sendPackets(int totalPackets) {
        Scanner sc = new Scanner(System.in);

        while (sequenceNumber < totalPackets || !window.isEmpty()) {
            // Send packets until window is full
            while (sequenceNumber < totalPackets && window.size() < windowSize) {
                window.add(sequenceNumber);
                System.out.println("Sent packet: " + sequenceNumber++);
            }

            // Simulate Acknowledgement handling
            System.out.print("Enter ack for packet(s) (comma-separated) or 'exit' to quit: ");
            String ackInput = sc.nextLine().trim();

            if (ackInput.equalsIgnoreCase("exit")) {
                break;
            }

            try {
                String[] acks = ackInput.split(",");
                for (String ack : acks) {
                    int ackNum = Integer.parseInt(ack.trim());
                    if (window.contains(ackNum)) {
                        window.remove(ackNum);
                        System.out.println("Received ack for packet: " + ackNum);
                    } else {
                        System.out.println("Invalid ack: " + ackNum + " (not in current window)");
                    }
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter numbers separated by commas.");
            }
        }

        sc.close();
    }

    public static void main(String args[]) {
        int windowSize = 4;
        int totalPackets = 10;

        Sender sender = new Sender(windowSize);
        sender.sendPackets(totalPackets);
        System.out.println("Transmission complete.");
    }
}
