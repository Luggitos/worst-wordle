package pedro.wordle.utils;

import java.util.Random;

import static pedro.wordle.utils.Words.WORDS;

public class WordGenerator {
    
    public WordGenerator() {
    };

    public static String getRandomWord(){
        int pos = generateNumber();

        return WORDS.get(pos);
    }

    private static Integer generateNumber() {
        Random random = new Random();
        int number = random.nextInt(WORDS.size());

        return number;
    }
}