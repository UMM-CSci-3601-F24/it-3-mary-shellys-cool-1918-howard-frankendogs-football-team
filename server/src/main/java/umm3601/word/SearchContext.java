package umm3601.word;

import java.util.ArrayList;

public class SearchContext {
  public ArrayList<Word> words;
  public ArrayList<Search> searches;

  public void searchContext(ArrayList<Word> words, ArrayList<Search> searches){
    this.words = words;
    this.searches = searches;
  }

  public void setWords(ArrayList<Word> words){
    this.words = words;
  }
  public void setSearches(ArrayList<Search> searches){
    this.searches = searches;
  }
  // public ArrayList<Word> getWords() {
  //   return this.words;
  // }

}
