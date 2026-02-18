import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * AI-generated log parser
 */
public class LogParserAI {

    private static final String LOG_DIR = "logs/";

    static class LogEntry {
        LocalDateTime timestamp;
        String level;
        String message;

        LogEntry(LocalDateTime ts, String lvl, String msg) {
            timestamp = ts;
            level = lvl;
            message = msg;
        }

        String toCSV() {
            return timestamp + "," + level + "," + message;
        }
    }

    // Parse single log line
    public static LogEntry parseLine(String line) {
        // Example format: [2025-08-31T12:34:56] INFO - Message text
        try {
            int first = line.indexOf("]");
            String tsStr = line.substring(1, first);
            LocalDateTime ts = LocalDateTime.parse(tsStr);
            String rest = line.substring(first + 2);
            String[] parts = rest.split(" - ", 2);
            return new LogEntry(ts, parts[0], parts[1]);
        } catch (Exception e) {
            return null;
        }
    }

    // Read all log files
    public static List<LogEntry> readLogs(String dir) throws IOException {
        List<LogEntry> entries = new ArrayList<>();
        DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(dir), "*.log");
        for (Path path : stream) {
            List<String> lines = Files.readAllLines(path);
            for (String line : lines) {
                LogEntry entry = parseLine(line);
                if (entry != null) entries.add(entry);
            }
        }
        return entries;
    }

    // Save logs to CSV
    public static void saveCSV(List<LogEntry> entries, String fileName) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            writer.write("Timestamp,Level,Message\n");
            for (LogEntry entry : entries) {
                writer.write(entry.toCSV());
                writer.newLine();
            }
        }
    }

    public static void main(String[] args) {
        try {
            List<LogEntry> logs = readLogs(LOG_DIR);

            // Filter error logs
            List<LogEntry> errors = new ArrayList<>();
            for (LogEntry e : logs) {
                if (e.level.equals("ERROR")) errors.add(e);
            }

            saveCSV(logs, "all_logs.csv");
            saveCSV(errors, "error_logs.csv");

            System.out.println("Parsed " + logs.size() + " entries, errors: " + errors.size());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
