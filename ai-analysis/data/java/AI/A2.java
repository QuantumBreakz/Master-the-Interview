import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.FileWriter;
import java.io.IOException;

/**
 * AI-generated API interaction example
 */
public class APIClientAI {

    private static final String[] urls = {
            "https://api.example.com/users",
            "https://api.example.com/orders",
            "https://api.example.com/products"
    };

    // Fetch JSON from URL
    public static JSONArray fetchJSON(String urlStr) throws IOException {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        conn.disconnect();

        return new JSONArray(content.toString());
    }

    // Save JSONArray to CSV
    public static void saveCSV(JSONArray arr, String filename) throws IOException {
        try (FileWriter writer = new FileWriter(filename)) {
            if (arr.length() > 0) {
                JSONObject first = arr.getJSONObject(0);
                String header = String.join(",", first.keySet());
                writer.write(header + "\n");
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    StringBuilder line = new StringBuilder();
                    for (String key : first.keySet()) {
                        line.append(obj.optString(key)).append(",");
                    }
                    line.deleteCharAt(line.length() - 1);
                    writer.write(line.toString() + "\n");
                }
            }
        }
    }

    public static void main(String[] args) {
        for (String url : urls) {
            try {
                JSONArray data = fetchJSON(url);
                String fileName = url.substring(url.lastIndexOf("/") + 1) + ".csv";
                saveCSV(data, fileName);
                System.out.println("Saved " + fileName + " with " + data.length() + " entries.");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
