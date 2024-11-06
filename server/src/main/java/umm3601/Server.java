package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.bson.UuidRepresentation;

import io.javalin.Javalin;
import io.javalin.http.InternalServerErrorResponse;

/**
 * The class used to configure and start a Javalin server.
 */
public class Server {

  // The port that the server should run on.
  private static final int SERVER_PORT = 4567;

  // The `mongoClient` field is used to access the MongoDB
  private final MongoClient mongoClient;

  // The `controllers` field is an array of all the `Controller` implementations
  // for the server. This is used to add routes to the server.
  private Controller[] controllers;

  /**
   * Construct a `Server` object that we'll use (via `startServer()`) to configure
   * and start the server.
   *
   * @param mongoClient The MongoDB client object used to access to the database
   * @param controllers The implementations of `Controller` used for this server
   */
  public Server(MongoClient mongoClient, Controller[] controllers) {
    this.mongoClient = mongoClient;
    // This is what is known as a "defensive copy". We make a copy of
    // the array so that if the caller modifies the array after passing
    // it in, we don't have to worry about it. If we didn't do this,
    // the caller could modify the array after passing it in, and then
    // we'd be using the modified array without realizing it.
    this.controllers = Arrays.copyOf(controllers, controllers.length);
  }

  /**
   * Setup the MongoDB database connection.
   *
   * This "wires up" the database using either system environment variables
   * or default values. If you're running the server locally without any environment
   * variables set, this will connect to the `dev` database running on your computer
   * (`localhost`). If you're running the server on Digital Ocean using our setup
   * script, this will connect to the production database running on server.
   *
   * This sets both the `mongoClient` and `database` fields
   * so they can be used when setting up the Javalin server.
   * @param mongoAddr The address of the MongoDB server
   *
   * @return The MongoDB client object
   */
  static MongoClient configureDatabase(String mongoAddr) {
    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(MongoClientSettings
      .builder()
      .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      // Old versions of the mongodb-driver-sync package encoded UUID values (universally unique identifiers) in
      // a non-standard way. This option says to use the standard encoding.
      // See: https://studio3t.com/knowledge-base/articles/mongodb-best-practices-uuid-data/
      .uuidRepresentation(UuidRepresentation.STANDARD)
      .build());

    return mongoClient;
  }

  /**
   * Configure and start the server.
   *
   * This configures and starts the Javalin server, which will start listening for HTTP requests.
   * It also sets up the server to shut down gracefully if it's killed or if the
   * JVM is shut down.
   */
  void startServer() {
    Javalin javalin = configureJavalin();
    setupRoutes(javalin);
    javalin.start(SERVER_PORT);
  }

  /**
   * Configure the Javalin server. This includes
   *
   * - Adding a route overview plugin to make it easier to see what routes
   *   are available.
   * - Setting it up to shut down gracefully if it's killed or if the
   *   JVM is shut down.
   * - Setting up a handler for uncaught exceptions to return an HTTP 500
   *   error.
   *
   * @return The Javalin server instance
   */
  private Javalin configureJavalin() {
    /*
     * Create a Javalin server instance. We're using the "create" method
     * rather than the "start" method here because we want to set up some
     * things before the server actually starts. If we used "start" it would
     * start the server immediately and we wouldn't be able to do things like
     * set up routes. We'll call the "start" method later to actually start
     * the server.
     *
     * `plugins.register(new RouteOverviewPlugin("/api"))` adds
     * a helpful endpoint for us to use during development. In particular
     * `http://localhost:4567/api` shows all of the available endpoints and
     * what HTTP methods they use. (Replace `localhost` and `4567` with whatever server
     * and  port you're actually using, if they are different.)
     */
    Javalin server = Javalin.create(config ->
      config.bundledPlugins.enableRouteOverview("/api")
    );

    // Configure the MongoDB client and the Javalin server to shut down gracefully.
    configureShutdowns(server);

    // This catches any uncaught exceptions thrown in the server
    // code and turns them into a 500 response ("Internal Server
    // Error Response"). In general you'll like to *never* actually
    // return this, as it's an instance of the server crashing in
    // some way, and returning a 500 to your user is *super*
    // unhelpful to them. In a production system you'd almost
    // certainly want to use a logging library to log all errors
    // caught here so you'd know about them and could try to address
    // them.
    server.exception(Exception.class, (e, ctx) -> {
      throw new InternalServerErrorResponse(e.toString());
    });

    return server;
  }

  /**
   * Configure the server and the MongoDB client to shut down gracefully.
   *
   * @param mongoClient The MongoDB client
   * @param server The Javalin server instance
   */
  private void configureShutdowns(Javalin server) {
    /*
     * We want the server to shut down gracefully if we kill it
     * or if the JVM dies for some reason.
     */
    Runtime.getRuntime().addShutdownHook(new Thread(server::stop));
    /*
     * We want to shut the `mongoClient` down if the server either
     * fails to start, or when it's shutting down for whatever reason.
     * Since the mongClient needs to be available throughout the
     * life of the server, the only way to do this is to wait for
     * these events and close it then.
     */
    server.events(event -> {
      event.serverStartFailed(mongoClient::close);
      event.serverStopped(mongoClient::close);
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
