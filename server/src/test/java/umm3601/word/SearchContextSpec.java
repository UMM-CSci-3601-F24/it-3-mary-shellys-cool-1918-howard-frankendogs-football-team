package umm3601.word;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SearchContextSpec {
  private Word word1;
  private Word word2;
  private ArrayList<Word> wordArray = new ArrayList<Word>(Arrays.asList(word1, word2));

  private Search search1;
  private Search search2;
  private ArrayList<Search> searchArray = new ArrayList<Search>(Arrays.asList(search1,search2));

  private SearchContext searchContext;

  @BeforeEach
  void setupEach() {
    word1 = new Word();
    word2 = new Word();

    search1 = new Search();
    search2 = new Search();
    searchContext = new SearchContext();
  }

  @Test
  void setWordWorks() {
    searchContext.setWords(wordArray);
    assertEquals(searchContext.words, wordArray);;
  }
  @Test
  void setSearchesWorks() {
    searchContext.setSearches(searchArray);
    assertEquals(searchContext.searches, searchArray);;
  }
}
