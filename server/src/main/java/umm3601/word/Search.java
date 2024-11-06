package umm3601.word;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Search {
  @ObjectId @Id
  @SuppressWarnings({"memberName"})
  public String _id;
  public String contains;
  public String wordGroup;

  public void setContains(String contains) {
    this.contains = contains;
  }
  public void setWordGroup(String wordGroup) {
    this.wordGroup = wordGroup;
  }
}
