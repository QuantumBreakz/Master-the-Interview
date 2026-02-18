import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI-generated NLP text processing example
 */
public class TextProcessingAI {

    // Load text files from folder
    public static List<String> loadTexts(String folder) throws IOException {
        List<String> texts = new ArrayList<>();
        DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(folder), "*.txt");
        for (Path path : stream) {
            String content = new String(Files.readAllBytes(path));
            texts.add(content);
        }
        return texts;
    }

    // Clean text: lowercase, remove punctuation
    public static String cleanText(String text) {
        return text.toLowerCase().replaceAll("\\p{Punct}", " ").trim();
    }

    // Tokenize text into words
    public static List<String> tokenize(String text) {
        return Arrays.asList(text.split("\\s+"));
    }

    // Remove stopwords
    public static List<String> removeStopWords(List<String> tokens, Set<String> stopWords) {
        return tokens.stream().filter(t -> !stopWords.contains(t)).collect(Collectors.toList());
    }

    // Count word frequencies
    public static Map<String, Integer> countWords(List<String> tokens) {
        Map<String, Integer> freq = new HashMap<>();
        for (String token : tokens) {
            freq.put(token, freq.getOrDefault(token, 0) + 1);
        }
        return freq;
    }

    // Example stopwords set
    public static Set<String> stopWords() {
        return new HashSet<>(Arrays.asList("the", "and", "is", "in", "of", "to"));
    }

    public static void main(String[] args) {
        try {
            List<String> texts = loadTexts("texts/");
            Set<String> stops = stopWords();
            Map<String, Integer> globalFreq = new HashMap<>();

            for (String text : texts) {
                String clean = cleanText(text);
                List<String> tokens = tokenize(clean);
                tokens = removeStopWords(tokens, stops);
                Map<String, Integer> freq = countWords(tokens);

                for (Map.Entry<String, Integer> e : freq.entrySet()) {
                    globalFreq.put(e.getKey(), globalFreq.getOrDefault(e.getKey(), 0) + e.getValue());
                }
            }

            // Top 20 words
            globalFreq.entrySet().stream()
                    .sorted((a,b)->b.getValue()-a.getValue())
                    .limit(20)
                    .forEach(e -> System.out.println(e.getKey()+": "+e.getValue()));

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
