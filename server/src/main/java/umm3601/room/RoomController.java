package umm3601.room;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.fasterxml.jackson.databind.RuntimeJsonMappingException;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
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

  @Override
  public void addRoutes(Javalin server) {
    server.post(API_ROOMS, this::addRoom);
  }
}
