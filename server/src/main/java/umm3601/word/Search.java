package umm3601.word;

import org.bson.conversions.Bson;
import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Search {
  @ObjectId @Id
  public String _id;
  public Bson params; // I don't think this will be a String, more like HashMap


  public Search(Bson params){
    this.params = params;
  }
}
