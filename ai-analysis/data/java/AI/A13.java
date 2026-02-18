import java.util.*;

public class CRC {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter Message: ");
        String msg = sc.next();
        
        System.out.print("Enter Generator: ");
        String gen = sc.next();
        
        // Append zeros equal to (length of generator - 1)
        String dividend = msg + "0".repeat(gen.length() - 1);
        
        // Calculate CRC remainder
        String crc = getRemainder(dividend, gen);
        
        // Form the codeword
        String codeword = msg + crc;
        
        System.out.println("CRC: " + crc);
        System.out.println("CodeWord: " + codeword);
        
        System.out.print("Enter CodeWord to Check: ");
        String recv = sc.next();
        
        // Check if remainder is all zeros
        String result = getRemainder(recv, gen).matches("0*") ? "Valid" : "Invalid";
        System.out.println(result);
        
        sc.close();
    }

    static String getRemainder(String dividend, String gen) {
        char[] div = dividend.toCharArray();
        int len = gen.length();
        
        for (int i = 0; i <= div.length - len; i++) {
            if (div[i] == '1') {
                for (int j = 0; j < len; j++) {
                    div[i + j] = div[i + j] == gen.charAt(j) ? '0' : '1';
                }
            }
        }
        
        // Return the last (len - 1) bits as remainder
        return new String(div).substring(div.length - (len - 1));
    }
}
