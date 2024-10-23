package umm3601.grid;
import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Grid {
  @ObjectId @Id
  @SuppressWarnings({"memeberName"})
  private String _id;
  private String owner;
  private GridCell[][] grid;

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
