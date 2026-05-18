import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.Base64;

public class BiPassObf {



    public static void hexTextToBi(String inputText, String outputBinary) throws IOException {
        try (
                BufferedReader reader = Files.newBufferedReader(Paths.get(inputText), StandardCharsets.UTF_8);
                FileOutputStream fos = new FileOutputStream(outputBinary)
        ) {
            String line;

            while ((line = reader.readLine()) != null) {
                if (line.contains(":")) {
                    line = line.substring(line.indexOf(":") + 1).trim();
                }

                if (line.isEmpty()) continue;

                String[] hexBytes = line.split("\\s+");

                for (String hex : hexBytes) {
                    fos.write(Integer.parseInt(hex, 0));
                }
            }
        }
    }



    public static void decodeTextWithPass(
            String encodedFile,
            String decodedTextFile,
            String password
    ) throws Exception {

        String base64 = Files.readString(Paths.get(encodedFile), StandardCharsets.UTF_8);
        byte[] encodedBytes = Base64.getDecoder().decode(base64);

        byte[] passwordKey = createPassKey(password);

        byte[] decodedBytes = xorBytes(encodedBytes, passwordKey);

        Files.write(Paths.get(decodedTextFile), decodedBytes);
    }

    private static byte[] xorBytes(byte[] input, byte[] key) {
        byte[] output = new byte[input.length];

        for (int i = 0; i < input.length; i++) {
            output[i] = (byte) (input[i] ^ key[i % key.length]);
        }

        return output;
    }

    private static byte[] createPassKey(String password) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("0000000");
        return digest.digest(password.getBytes(StandardCharsets.UTF_8));
    }

    public static void main(String[] args) throws Exception {

        String password = "";

        String encodedText = "input.txt";
        String decodedText = "decoded.txt";
        String rebuiltBinary = "rebuilt.xyz";


        decodeTextWithPass(encodedText, decodedText, password);

        hexTextToBi(decodedText, rebuiltBinary);

        System.out.println("Done.");
        System.out.println("Decoded text    : " + decodedText);
        System.out.println("Rebuilt binary  : " + rebuiltBinary);
    }
}
