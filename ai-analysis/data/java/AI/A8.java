import java.io.*;
import java.nio.file.*;
import java.util.zip.*;

/**
 * AI-generated file compression example
 * Compresses all files in a directory into a single zip archive
 */
public class FileCompressionAI {

    // Compress all files in folder into zip
    public static void zipDirectory(String sourceDir, String zipFile) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
            Files.walk(Paths.get(sourceDir))
                    .filter(Files::isRegularFile)
                    .forEach(path -> {
                        ZipEntry zipEntry = new ZipEntry(Paths.get(sourceDir).relativize(path).toString());
                        try {
                            zos.putNextEntry(zipEntry);
                            Files.copy(path, zos);
                            zos.closeEntry();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }
    }

    // Extract zip archive
    public static void unzip(String zipFile, String targetDir) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                File file = new File(targetDir, entry.getName());
                file.getParentFile().mkdirs();
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        fos.write(buffer, 0, len);
                    }
                }
                zis.closeEntry();
            }
        }
    }

    public static void main(String[] args) {
        String sourceDir = "files_to_zip/";
        String zipFile = "archive.zip";
        String extractDir = "extracted/";

        try {
            zipDirectory(sourceDir, zipFile);
            System.out.println("Files compressed into " + zipFile);

            unzip(zipFile, extractDir);
            System.out.println("Files extracted to " + extractDir);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
