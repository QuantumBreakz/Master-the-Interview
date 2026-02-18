import java.util.Random;
import java.util.Scanner;

/**
 * AI-generated number guessing game simulation
 * Demonstrates random number generation, user input, and game logic
 */
public class GameSimulationAI {

    // Maximum number for random number
    private static final int MAX_NUMBER = 100;

    // Number of allowed attempts
    private static final int MAX_ATTEMPTS = 10;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        System.out.println("Welcome to the Number Guessing Game!");
        int target = random.nextInt(MAX_NUMBER) + 1;
        int attempts = 0;
        boolean won = false;

        while (attempts < MAX_ATTEMPTS) {
            System.out.print("Enter your guess (1-" + MAX_NUMBER + "): ");
            int guess = scanner.nextInt();
            attempts++;

            if (guess == target) {
                System.out.println("Congratulations! You guessed the number in " + attempts + " attempts.");
                won = true;
                break;
            } else if (guess < target) {
                System.out.println("Too low! Try a higher number.");
            } else {
                System.out.println("Too high! Try a lower number.");
            }
        }

        if (!won) {
            System.out.println("Sorry! You did not guess the number. It was: " + target);
        }

        System.out.println("Game Over. Thank you for playing!");
        scanner.close();
    }
}
