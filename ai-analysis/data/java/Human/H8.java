import java.io.*;
import java.nio.file.*;
import java.util.zip.*;

public class FileCompressionHuman {

 static String src="files_to_zip/";
 static String zipf="archive.zip";
 static String dest="extracted/";

 public static void zipDir(String srcDir,String zipFile){
  try(ZipOutputStream zos=new ZipOutputStream(new FileOutputStream(zipFile))){
   Files.walk(Paths.get(srcDir)).filter(Files::isRegularFile).forEach(path->{
    ZipEntry ze=new ZipEntry(Paths.get(srcDir).relativize(path).toString());
    try{
     zos.putNextEntry(ze);
     Files.copy(path,zos);
     zos.closeEntry();
    }catch(IOException e){e.printStackTrace();}
   });
  }catch(IOException e){System.out.println("Error compressing");}
 }

 public static void unzip(String zipFile,String targetDir){
  try(ZipInputStream zis=new ZipInputStream(new FileInputStream(zipFile))){
   ZipEntry entry;
   while((entry=zis.getNextEntry())!=null){
    File f=new File(targetDir,entry.getName());
    f.getParentFile().mkdirs();
    try(FileOutputStream fos=new FileOutputStream(f)){
     byte[] buf=new byte[1024];
     int len;
     while((len=zis.read(buf))>0) fos.write(buf,0,len);
    }
    zis.closeEntry();
   }
  }catch(IOException e){System.out.println("Error extracting");}
 }

 public static void main(String[] args){
  zipDir(src,zipf);
  System.out.println("Compressed to "+zipf);
  unzip(zipf,dest);
  System.out.println("Extracted to "+dest);
 }
}
