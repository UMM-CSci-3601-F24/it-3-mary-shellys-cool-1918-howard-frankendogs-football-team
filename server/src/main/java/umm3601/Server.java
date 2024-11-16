package umm3601;

import io.javalin.Javalin;
import io.javalin.http.InternalServerErrorResponse;
import io.javalin.websocket.WsContext;

import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.bson.UuidRepresentation;

public class Server {

  private static final int SERVER_PORT = 4567;
  private static final long WEB_SOCKET_PING_INTERVAL = 5;
  private static Set<WsContext> connectedClients = ConcurrentHashMap.newKeySet();
  private final MongoClient mongoClient;
  private final Controller[] controllers;

  /**
   * Constructs a new Server instance.
   *
   * @param mongoClient The MongoDB client
   * @param controllers The array of controllers to add routes to the server
   */
  public Server(MongoClient mongoClient, Controller[] controllers) {
    this.mongoClient = mongoClient;

    this.controllers = controllers;
  }

  /**
   * Configures the MongoDB client.
   *
   * @param mongoAddr The address of the MongoDB server
   * @return The configured MongoDB client
   */
  public static MongoClient configureDatabase(String mongoAddr) {
    MongoClient mongoClient = MongoClients.create(MongoClientSettings
        .builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        .uuidRepresentation(UuidRepresentation.STANDARD)
        .build());
    return mongoClient;
  }

  /**
   * Starts the Javalin server.
   */
  public void startServer() {
    System.out.println("Starting server...");
    Javalin javalin = configureJavalin();
    setupRoutes(javalin);
    javalin.start(SERVER_PORT);
    System.out.println("Server started on port " + SERVER_PORT);
  }

  /**
   * Configures the Javalin server. This includes setting up WebSocket endpoints
   *
   * @return The configured Javalin server instance
   */
  private Javalin configureJavalin() {
    Javalin server = Javalin.create(config -> {
      config.bundledPlugins.enableRouteOverview("/api");
    });

    System.out.println("Configuring WebSocket endpoint...");
    server.ws("/api/websocket", ws -> {
      System.out.println("WebSocket endpoint created");
      ws.onConnect(ctx -> {
        connectedClients.add(ctx);
        ctx.enableAutomaticPings(WEB_SOCKET_PING_INTERVAL, TimeUnit.SECONDS);
        System.out.println("Client connected");
      });

      ws.onMessage(ctx -> {
        String message = ctx.message();
        System.out.println("Received message from client");
        broadcastMessage(message);
      });

      ws.onClose(ctx -> {
        connectedClients.remove(ctx);
        System.out.println("Client disconnected");
      });
    });

    configureShutdowns(server);
    server.exception(Exception.class, (e, ctx) -> {
      throw new InternalServerErrorResponse(e.toString());
    });

    return server;
  }

  /**
   * Broadcasts a message to all connected WebSocket clients.
   *
   * @param message The message to broadcast
   */
  private static void broadcastMessage(String message) {
    for (WsContext client : connectedClients) {
      client.send(message);
    }
  }

  /**
   * Configures the server to shut down without a massive fire.
   *
   * @param server The Javalin server instance
   */
  private void configureShutdowns(Javalin server) {
    Runtime.getRuntime().addShutdownHook(new Thread(server::stop));
    server.events(event -> {
      event.serverStartFailed(() -> System.out.println("Server failed to start"));
      event.serverStopped(() -> System.out.println("Server stopped"));
    });
  }

  /**
   * Setup routes for the server.
   *
   * @param server The Javalin server instance
   */
  private void setupRoutes(Javalin server) {
    // Add the routes for each of the implementations of `Controller` in the
    // `controllers` array.
    for (Controller controller : controllers) {
      controller.addRoutes(server);
    }
  }
}
