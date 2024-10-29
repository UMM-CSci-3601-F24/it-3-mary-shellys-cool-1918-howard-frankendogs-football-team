package umm3601.grid;

import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class GridController implements Controller {

  private static final String API_GRID_BY_ID = "/api/grids/{id}";
  private static final String API_GRIDS = "/api/grids";
  private final JacksonMongoCollection<Grid> gridCollection;

  public GridController(MongoDatabase database) {
    gridCollection = JacksonMongoCollection.builder().build(
        database,
        "grids",
        Grid.class,
        UuidRepresentation.STANDARD);
  }

  public void saveGrid(Context ctx) {
    String body = ctx.body();
    Grid grid = ctx.bodyValidator(Grid.class)
        .check(td -> td.owner != null, "Owner must be non-empty")
        .check(td -> td.grid != null, "Error with grid, grid was : " + body)
        .getOrThrow(m -> new RuntimeJsonMappingException("Failed to parse body as grid: " + body));
    System.err.println(grid._id);
    // System.err.println(grid.toString());
    gridCollection.insertOne(grid);
    // ctx.json(Map.of("id", grid._id));
    System.err.println(grid._id);

    ctx.json(grid);
    ctx.status(HttpStatus.CREATED);
  }

  public void getGrid(Context ctx) {
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

  public void getGrids(Context ctx) {
    System.out.println("entered getGrids() in grid controller.java");

    ArrayList<Grid> gridsList = gridCollection
        .find().into(new ArrayList<>());
    ctx.json(gridsList);
    ctx.status(HttpStatus.OK);
  }

  @Override
  public void addRoutes(Javalin server) {
    server.get(API_GRID_BY_ID, this::getGrid);
    server.get(API_GRIDS, this::getGrids);
    server.post(API_GRIDS, this::saveGrid);
  }
}
