package umm3601.grid;
import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Grid {
  @ObjectId @Id
  @SuppressWarnings({"memeberName"})
  public String _id;
  public String owner;
  public Grid grid;
}
