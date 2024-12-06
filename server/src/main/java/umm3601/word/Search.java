package umm3601.word;
import java.util.Date;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Search {
  @ObjectId @Id
  @SuppressWarnings({"memberName"})
  public String _id;
  public Date timeStamp;
  public String contains;
  public String wordGroup;
  public String filterType;

  public void setContains(String contains) {
    this.contains = contains;
  }
  public void setWordGroup(String wordGroup) {
    this.wordGroup = wordGroup;
  }
  public void setFilterType(String type) {
    this.filterType = type;
  }
  public void setTimeStamp(Date time) {
    this.timeStamp = time;
  }
}
