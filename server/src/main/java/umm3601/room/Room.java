package umm3601.room;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Room {
  @ObjectId @Id
  @SuppressWarnings({"memberName"})
  public String _id;
  public String name;

  public String getId() {
    return _id;
  }

  public void setId(String id) {
    this._id = id;
  }
}
