import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.opencsv.CSVWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * AI-generated web scraping example
 */
public class WebScraperAI {

    // List of URLs to scrape
    private static final String[] urls = {
            "https://example.com/page1",
            "https://example.com/page2",
            "https://example.com/page3"
    };

    // Class to hold item data
    static class Item {
        String title;
        String price;
        String link;

        Item(String t, String p, String l) {
            title = t;
            price = p;
            link = l;
        }

        String[] toArray() {
            return new String[]{title, price, link};
        }
    }

    // Fetch and parse page
    public static List<Item> parsePage(String url) throws IOException {
        List<Item> items = new ArrayList<>();
        Document doc = Jsoup.connect(url).get();
        Elements elements = doc.select("div.item");

        for (Element el : elements) {
            String title = el.select("h2").text();
            String price = el.select("span.price").text();
            String link = el.select("a[href]").attr("href");
            items.add(new Item(title, price, link));
        }
        return items;
    }

    // Write CSV
    public static void writeCSV(List<Item> allItems, String filename) throws IOException {
        try (CSVWriter writer = new CSVWriter(new FileWriter(filename))) {
            String[] header = {"Title", "Price", "Link"};
            writer.writeNext(header);
            for (Item item : allItems) {
                writer.writeNext(item.toArray());
            }
        }
    }

    public static void main(String[] args) {
        List<Item> allItems = new ArrayList<>();
        try {
            for (String url : urls) {
                List<Item> items = parsePage(url);
                allItems.addAll(items);
            }
            writeCSV(allItems, "scraped_data.csv");
            System.out.println("Scraping completed. Total items: " + allItems.size());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
