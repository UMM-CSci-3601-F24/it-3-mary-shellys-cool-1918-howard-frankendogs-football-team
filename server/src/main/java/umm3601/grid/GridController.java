package umm3601.grid;

import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

  private static final String API_GRID_BY_ID = "/api/grids/{}";
  private static final String API_SAVE_GRID = "/api/grid";
  // private static final String API_SAVE_GRID = "/api/save-grid";
  private static final String API_GET_GRIDS = "/api/grids";
  private final JacksonMongoCollection<Grid> gridCollection;

  public GridController(MongoDatabase database) {
    gridCollection = JacksonMongoCollection.builder().build(
      database,
      "grids",
      Grid.class,
      UuidRepresentation.STANDARD); // no idea what this last line does
  }

  public void saveGrid(Context ctx) {
    // this returns an unrecognized property exception
    // Grid grid = ctx.bodyAsClass(Grid.class);
    // gridCollection.insert(grid);
    // ctx.json(Map.of("id", grid._id));
    // ctx.status(HttpStatus.CREATED);

    // this returns a 400 Bad request response with a deserialization error
    String body = ctx.body();
    Grid grid = ctx.bodyValidator(Grid.class)
      // .check(td -> td.owner != null, "Owner must be non-empty")
      // .check(td -> td.grid != null, "Error with grid, grid was : " + body)
      .getOrThrow(m -> new RuntimeJsonMappingException("Failed to parse body as grid: " + body));
    gridCollection.insertOne(grid);
    ctx.json(Map.of("id", grid._id));
    ctx.status(HttpStatus.CREATED);

  }

  // public void getGrid(Context ctx) {
  //   String id = ctx.pathParam("id");
  //   Grid grid;

  //   try {
  //     grid = gridCollection.find(eq("_id", new ObjectId(id))).first();
  //   } catch (IllegalArgumentException e) {
  //     throw new BadRequestResponse("The requested grid id wasn't a legal Mongo Object ID");
  //   }
  //   if (grid == null) {
  //     throw new NotFoundResponse("The requested grid was not found");
  //   } else {
  //     ctx.json(grid);
  //     ctx.status(HttpStatus.OK);
  //   }
  // }

  // public void getGrids(Context ctx) {
  //   List<Grid> gridsList = gridCollection.find().into(new ArrayList<>());
  //   Grid[] gridsArray = gridsList.toArray(new Grid[0]);
  //   ctx.json(gridsArray);  // public void getGrid(Context ctx) {
  //   String id = ctx.pathParam("id");
  //   Grid grid;

  //   try {
  //     grid = gridCollection.find(eq("_id", new ObjectId(id))).first();
  //   } catch (IllegalArgumentException e) {
  //     throw new BadRequestResponse("The requested grid id wasn't a legal Mongo Object ID");
  //   }
  //   if (grid == null) {
  //     throw new NotFoundResponse("The requested grid was not found");
  //   } else {
  //     ctx.json(grid);
  //     ctx.status(HttpStatus.OK);
  //   }
  // }
  //   ctx.status(HttpStatus.OK);
  // }

  @Override
  public void addRoutes(Javalin server) {
    // server.get(API_GRID_BY_ID, this::getGrid);
    server.post(API_SAVE_GRID, this::saveGrid);
    // server.get(API_GET_GRIDS, this::getGrids);
  }
}

