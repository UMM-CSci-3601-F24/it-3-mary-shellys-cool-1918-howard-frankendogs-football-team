package umm3601.word;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class WordSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Word word1;
  private Word word2;

  @BeforeEach
  void setupEach() {
    word1 = new Word();
    word2 = new Word();
  }

  @Test
  void wordsWithEqualIdAreEqual() {
    word1._id = FAKE_ID_STRING_1;
    word2._id = FAKE_ID_STRING_1;

    assertTrue(word1.equals(word2));
  }

  @Test
  void wordsWithDifferentIdAreNotEqual() {
    word1._id = FAKE_ID_STRING_1;
    word2._id = FAKE_ID_STRING_2;

    assertFalse(word1.equals(word2));
  }

  @Test
  void compareWordWithNonWord() {
    assertFalse(word1.equals(word1._id));
  }

  @Test
  void hashCodesAreBasedOnId() {
    word1._id = FAKE_ID_STRING_1;
    word2._id = FAKE_ID_STRING_1;

    assertTrue(word1.hashCode() == word2.hashCode());
  }

  @Test
  void toStringReturnsString() {
    word1.word = "blah";

    assertTrue(word1.toString() == word1.word);
  }

}
