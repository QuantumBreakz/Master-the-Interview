import java.util.*;
import java.util.concurrent.*;

/**
 * AI-generated task scheduler example
 * Simulates scheduling tasks at fixed intervals
 */
public class TaskSchedulerAI {

    static class Task implements Runnable {
        private String name;

        Task(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            System.out.println("Executing task: " + name + " at " + new Date());
        }
    }

    public static void main(String[] args) {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(3);

        // Schedule tasks at different intervals
        scheduler.scheduleAtFixedRate(new Task("Task A"), 0, 5, TimeUnit.SECONDS);
        scheduler.scheduleAtFixedRate(new Task("Task B"), 2, 10, TimeUnit.SECONDS);
        scheduler.scheduleAtFixedRate(new Task("Task C"), 1, 7, TimeUnit.SECONDS);

        // Run for 30 seconds and shutdown
        try {
            Thread.sleep(30000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            scheduler.shutdown();
            System.out.println("Scheduler stopped");
        }
    }
}
