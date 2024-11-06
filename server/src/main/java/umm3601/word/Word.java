package umm3601.word;
import org.mongojack.Id;
import org.mongojack.ObjectId;


@SuppressWarnings({"VisibilityModifier"})
public class Word {

    @ObjectId @Id
    @SuppressWarnings({"memberName"})
    public String _id;
    public String word;
    public String wordGroup;

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Word)) {
            return false;
        }
        Word other = (Word) obj;
        return _id.equals(other._id);
    }

    @Override
    public int hashCode() {
        return +_id.hashCode();
    }

    @Override
    public String toString() {
        return word;
    }
}
