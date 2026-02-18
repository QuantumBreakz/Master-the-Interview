import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionHuman {

 public static SecretKey genKey() {
    try
    {
    KeyGenerator k=KeyGenerator.getInstance("AES");
    k.init(128);
    return k.generateKey();
  }
  catch(Exception e){System.out.println("Key gen error");return null;}
 }

 public static String encrypt(String txt, SecretKey key){
  try
  {
    Cipher c=Cipher.getInstance("AES");
    c.init(Cipher.ENCRYPT_MODE,key);
    byte[] enc=c.doFinal(txt.getBytes());
    return Base64.getEncoder().encodeToString(enc);
    }
    catch(Exception e){System.out.println("Encrypt error");return null;}
 }

 public static String decrypt(String txt, SecretKey key){
    try{
        Cipher c=Cipher.getInstance("AES");
        c.init(Cipher.DECRYPT_MODE,key);
        byte[] dec=Base64.getDecoder().decode(txt);
        byte[] res=c.doFinal(dec);
        return new String(res);
    }
  catch(Exception e){System.out.println("Decrypt error");return null;}
 }

 public static void main(String[] args){
    SecretKey key=genKey();
    String msg="Secret message here";

    String enc=encrypt(msg,key);
    System.out.println("Enc: "+enc);

    String dec=decrypt(enc,key);
    System.out.println("Dec: "+dec);
 }
}
