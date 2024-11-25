package umm3601.grid;

// import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.validation.BodyValidator;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;

@SuppressWarnings({ "MagicNumber" })
public class GridControllerSpec {
  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<List<Grid>> gridListCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @Captor
  private ArgumentCaptor<Grid> gridCaptor;

  private GridController gridController;

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
    MongoCollection<Document> gridDocuments = db.getCollection("grids");
    gridDocuments.drop();
    List<Document> testGrids = new ArrayList<>();
    testGrids.add(new Document().append("roomID", "testRoomID").append("grid", new ArrayList<>()));
    gridDocuments.insertMany(testGrids);
    gridController = new GridController(db);
  }

  @Test
  void canGetAllGrids() throws IOException {
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());
    gridController.getGrids(ctx);
    verify(ctx).json(gridListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(db.getCollection("grids").countDocuments(), gridListCaptor.getValue().size());
  }

  @Test
  public void canBuildController() throws IOException {
    Javalin mockServer = Mockito.mock(Javalin.class);
    gridController.addRoutes(mockServer);
    /*
     * This tests how many 'get', 'delete' and 'post' routes there are
     * Change the get count to: verify(mockServer, Mockito.atLeast(2)).get(any(),
     * any());
     * when reinstate get words by group
     */
    verify(mockServer, Mockito.atLeastOnce()).get(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
  }

  // tests for getGrid()
  @Test
  void canGetGridById() throws IOException {
    MongoCollection<Document> gridDocuments = db.getCollection("grids");
    Document testGrid = new Document().append("roomID", "testRoomID").append("grid", new ArrayList<>());
    gridDocuments.insertOne(testGrid);
    String gridId = testGrid.getObjectId("_id").toHexString();

    when(ctx.pathParam("id")).thenReturn(gridId);

    gridController.getGrid(ctx);

    verify(ctx).json(gridCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(gridId, gridCaptor.getValue()._id);
  }

  @Test
  public void getGridWithBadID() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      gridController.getGrid(ctx);
    });

    assertEquals("The requested grid id wasn't a legal Mongo Object ID", exception.getMessage());
  }

  @Test
  public void getGridWithNonexistentId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("588935f5c668650dc77df581");

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      gridController.getGrid(ctx);
    });

    assertEquals("The requested grid was not found", exception.getMessage());
  }

}
