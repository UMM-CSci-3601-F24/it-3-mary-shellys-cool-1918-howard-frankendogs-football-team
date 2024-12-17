package umm3601.grid;
import umm3601.Controller;

import java.util.ArrayList;
import java.util.Date;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import static com.mongodb.client.model.Filters.eq;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;

public class GridController implements Controller {

  private static final String API_GRID_BY_ID = "/api/grids/{id}";
  private static final String API_GRIDS = "/api/grids";
  private static final String API_GRID_BY_ROOM = "/api/{roomID}/grids";

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
        .check(td -> td.roomID != null, "roomID must be non-empty")
        .check(td -> td.grid != null, "Error with grid, grid was : " + body)
        .getOrThrow(m -> new RuntimeJsonMappingException("Failed to parse body as grid: " + body));

    grid.lastSaved = new Date();

    if (grid._id != null) {
      // if the grid already has an ID, write over the copy in the server
      gridCollection.replaceOneById(grid._id, grid);
    } else {
      gridCollection.insertOne(grid);
    }
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

  // returns all grids in the database
  public void getGrids(Context ctx) {
    ArrayList<Grid> gridsList = gridCollection
        .find().into(new ArrayList<>());
    ctx.json(gridsList);
    ctx.status(HttpStatus.OK);
  }

  /**
   * Gets all grids belonging to the room
   * @param ctx context containing the room id
   */
  public void getGridsByRoom(Context ctx) {
    System.out.println("entered getGridsByRoom() in grid controller.java");
    String roomID = ctx.pathParam("roomID");

    ArrayList<Grid> gridsList = gridCollection
        .find(eq("roomID", roomID)).into(new ArrayList<>());
    ctx.json(gridsList);
    ctx.status(HttpStatus.OK);
  }

  /**
   * Deletes one grid by id
   * @param ctx context from client, containing id of grid to delete
   */
  public void deleteGrid(Context ctx) {
    String id = ctx.pathParam("id");
    ObjectId objectId;

    try {
      objectId = new ObjectId(id);
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested grid id wasn't a legal Mongo Object ID");
    }

    DeleteResult deleteResult = gridCollection.deleteOne(eq("_id", objectId));

    if (deleteResult.getDeletedCount() == 0) {
      throw new NotFoundResponse("The requested grid was not found");
    } else {
      ctx.json(new Document("deletedId", id));
      ctx.status(HttpStatus.OK);
    }
  }

  @Override
  public void addRoutes(Javalin server) {
    server.get(API_GRID_BY_ID, this::getGrid);
    server.get(API_GRIDS, this::getGrids);
    server.get(API_GRID_BY_ROOM, this::getGridsByRoom);
    server.post(API_GRIDS, this::saveGrid);
    server.delete(API_GRID_BY_ID, this::deleteGrid);
  }
}
