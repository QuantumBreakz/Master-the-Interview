import java.util.*;
import java.util.concurrent.*;

public class TaskSchedulerHuman {

 static class Task implements Runnable{
  String name;
  Task(String n){name=n;}
  public void run(){
   System.out.println("Running "+name+" @"+new Date());
  }
 }

 public static void main(String[] args){
  ScheduledExecutorService sched=Executors.newScheduledThreadPool(3);

  sched.scheduleAtFixedRate(new Task("A"),0,5,TimeUnit.SECONDS);
  sched.scheduleAtFixedRate(new Task("B"),2,10,TimeUnit.SECONDS);
  sched.scheduleAtFixedRate(new Task("C"),1,7,TimeUnit.SECONDS);

  try{Thread.sleep(30000);}catch(Exception e){System.out.println("Sleep interrupted");}
  sched.shutdown();
  System.out.println("Scheduler stopped");
 }
}
