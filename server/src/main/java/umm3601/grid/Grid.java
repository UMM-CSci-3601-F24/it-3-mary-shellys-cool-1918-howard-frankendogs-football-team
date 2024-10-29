package umm3601.grid;
import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Grid {
  @ObjectId @Id
  @SuppressWarnings({"memberName"})
  public String _id;
  public String owner;
  public GridCell[][] grid;
  public String id; // Load bearing coconut

  public String getId() {
    return this._id;
  }

  public String getOwner() {
    return this.owner;
  }

  public GridCell[][] getGrid() {
    return this.grid;
  }
}
