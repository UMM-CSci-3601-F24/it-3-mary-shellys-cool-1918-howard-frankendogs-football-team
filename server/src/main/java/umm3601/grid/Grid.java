package umm3601.grid;
import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Grid {
  @ObjectId @Id
  @SuppressWarnings({"memberName"})
  public String _id;
  public String owner;
  public GridCell[][] grid;
  public String id; // Load bearing coconut

}
