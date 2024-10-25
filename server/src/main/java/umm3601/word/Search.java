package umm3601.word;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Search {
  @ObjectId @Id
  public String _id;
  public String contains;
  public String wordGroup;// I don't think this will be a String, more like HashMap

  public void setContains(String contains) {
    this.contains = contains;
  }
  public void setWordGroup(String wordGroup) {
    this.wordGroup = wordGroup;
  }
}
