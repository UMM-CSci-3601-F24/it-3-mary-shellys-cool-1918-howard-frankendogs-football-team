package umm3601.room;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Collections;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.validation.BodyValidator;

public class RoomControllerSpec {
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<Room> roomCaptor;

  private RoomController roomController;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Collections.singletonList(new ServerAddress(mongoAddr))))
            .build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    MockitoAnnotations.openMocks(this);
    MongoCollection<Document> roomDocuments = db.getCollection("rooms");
    roomDocuments.drop();
    roomController = new RoomController(db);
  }

  @Test
  public void canBuildController() throws IOException {
    Javalin mockServer = Mockito.mock(Javalin.class);
    roomController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
  }

  @Test
  public void canAddRoom() throws IOException {
    Room room = new Room();
    room.setId("");
    room.name = "Test Room";

    String roomJson = "{ \"name\": \"Test Room\" }";

    when(ctx.body()).thenReturn(roomJson);
    when(ctx.bodyValidator(Room.class)).thenReturn(new BodyValidator<>(roomJson, Room.class, () -> room));

    roomController.addRoom(ctx);

    verify(ctx).status(HttpStatus.CREATED);
    verify(ctx).json(roomCaptor.capture());

    Room capturedRoom = roomCaptor.getValue();
    assertNotNull(capturedRoom.getId());

    Document addedRoom = db.getCollection("rooms")
        .find(new Document("_id", new ObjectId(capturedRoom.getId()))).first();

    assertEquals(capturedRoom.getId(), addedRoom.getObjectId("_id").toHexString());
  }

  @Test
  public void canGetRoomById() throws IOException {
    MongoCollection<Document> roomDocuments = db.getCollection("rooms");
    Document testRoom = new Document().append("name", "Test Room");
    roomDocuments.insertOne(testRoom);
    String roomId = testRoom.getObjectId("_id").toHexString();

    when(ctx.pathParam("id")).thenReturn(roomId);

    roomController.getRoomById(ctx);

    verify(ctx).json(roomCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(roomId, roomCaptor.getValue().getId());
  }
}
