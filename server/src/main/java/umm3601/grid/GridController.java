package umm3601.grid;

import static com.mongodb.client.model.Filters.eq;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.websocket.WsContext;
import umm3601.Controller;

public class GridController implements Controller{

  private static final String API_GRID_BY_ID = "/api/grid/{}";
  private final JacksonMongoCollection<Grid> gridCollection;

  public GridController(MongoDatabase database) {
    gridCollection = JacksonMongoCollection.builder().build(
      database,
      "grids",
      Grid.class,
      UuidRepresentation.STANDARD); // no idea what this last line does
  }

  public void getGrid(Context ctx){
    String id = ctx.pathParam("id");
    Grid grid;

    try {
      grid = gridCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested grid id wasn't a legal Mongo Object ID");
    }
    if (grid == null) {
      throw new NotFoundResponse("The requested grid was not found");
    } else {
      ctx.json(grid);
      ctx.status(HttpStatus.OK);
    }
  }

  @Override
  public void addRoutes(Javalin server) {
      // TODO Auto-generated method stub
      server.get(API_GRID_BY_ID, this::getGrid);

      throw new UnsupportedOperationException("Unimplemented method 'addRoutes'");
  }
}
