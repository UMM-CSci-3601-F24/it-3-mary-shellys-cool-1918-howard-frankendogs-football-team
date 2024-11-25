package umm3601.room;

import org.bson.UuidRepresentation;
import static com.mongodb.client.model.Filters.eq;
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


public class RoomController implements Controller {
  private static final String API_ROOMS = "/api/rooms";
  private final JacksonMongoCollection<Room> roomCollection;

  public RoomController(MongoDatabase database) {
    roomCollection = JacksonMongoCollection.builder().build(
        database,
        "rooms",
        Room.class,
        UuidRepresentation.STANDARD);
  }

  public void addRoom(Context ctx) {
    String body = ctx.body();
    Room room = ctx.bodyValidator(Room.class)
        .check(r -> r.name != null && !r.name.isEmpty(), "Room name must be non-empty")
        .getOrThrow(m -> new RuntimeJsonMappingException("Failed to parse body as grid: " + body));
    roomCollection.insertOne(room);

    ctx.json(room);
    ctx.status(HttpStatus.CREATED);
  }

  public void getRoomById(Context ctx) {
    String id = ctx.pathParam("id");
    Room room;
    try {
      room = roomCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested room id wasn't a legal Mongo Object ID");
    }
    if (room == null) {
      throw new NotFoundResponse("The requested room was not found");
    } else {
      ctx.json(room);
      ctx.status(HttpStatus.OK);
    }
  }

  @Override
  public void addRoutes(Javalin server) {
    server.post(API_ROOMS, this::addRoom);
    server.get(API_ROOMS + "/{id}", this::getRoomById);
  }
}
