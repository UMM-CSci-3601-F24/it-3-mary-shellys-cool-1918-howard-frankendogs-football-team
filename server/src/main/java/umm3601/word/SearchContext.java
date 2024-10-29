package umm3601.word;

import java.util.ArrayList;

@SuppressWarnings({"VisibilityModifier"})
public class SearchContext {
  public ArrayList<Word> words;
  public ArrayList<Search> searches;

  public SearchContext(ArrayList<Word> words, ArrayList<Search> searches) {
    this.words = words;
    this.searches = searches;
  }
  public void setWords(ArrayList<Word> words) {
    this.words = words;
  }
  public void setSearches(ArrayList<Search> searches) {
    this.searches = searches;
  }

}
