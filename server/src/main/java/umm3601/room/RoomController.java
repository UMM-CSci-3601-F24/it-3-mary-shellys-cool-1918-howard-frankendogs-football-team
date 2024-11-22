package umm3601.room;

import org.bson.UuidRepresentation;
import org.mongojack.JacksonMongoCollection;

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
    Room room = ctx.bodyAsClass(Room.class);
    roomCollection.insert(room);
    ctx.json(room);
    ctx.status(HttpStatus.CREATED);

  }

  @Override
  public void addRoutes(Javalin server) {
    server.post(API_ROOMS, this::addRoom);
  }
}
