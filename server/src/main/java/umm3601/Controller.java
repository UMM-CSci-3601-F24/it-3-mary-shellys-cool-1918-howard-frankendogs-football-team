package umm3601;

import io.javalin.Javalin;

/**
 * Interface for classes that can add routes to a Javalin server.
 *
 * Any class that implements this interface can be used to add routes to the
 * server via the specified `addRoutes()` method.
 *
 * This is useful for organizing routes into separate files, and for testing
 * routes without starting the server (except that the inability to compare
 * lambdas in fact makes this very hard to test).
 *
 * Any controller class that provides routes for the Javalin server
 * must implement this interface since the `Server` class
 * is just handed an array of `Controller` objects in its constructor. This
 * allows us to add routes to the server without having to modify the `Server`,
 * and without having the server know about any specific controller implementations.
 *
 * Note that this interface definition is _complete_ and you shouldn't need to
 * add anything to it. You just need to make sure that any new controllers
 * you implement also implement this interface, providing their own `addRoutes()`
 * method.
 */
public interface Controller {
  /**
   * Add routes to the server.
   *
   * If you have a controller that implements this interface, for example,
   * your implementation of `addRoutes()` would add all the routes for your
   * controller's datatype, by calling
   * `server.get(...)`, `server.post(...)`, etc.
   *
   * @param server The Javalin server to add routes to
   */
  void addRoutes(Javalin server);
}
