package umm3601.mongotest;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gt;
import static com.mongodb.client.model.Projections.excludeId;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 * <p>
 * Note that none of these are actually tests of any of our
 * code; they are mostly demonstrations of the behavior of
 * the MongoDB Java libraries. Thus if they test anything,
 * they test that code, and perhaps our understanding of it.
 * <p>
 * To test "our" code we'd want the tests to confirm that
 * the behavior of methods in things like the UserController
 * do the "right" thing.
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({"MagicNumber"})
class MongoSpec {

  private MongoCollection<Document> userDocuments;

  private static MongoClient mongoClient;
  private static MongoDatabase db;

  @BeforeAll
  static void setupDB() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void clearAndPopulateDB() {
    userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(
      new Document()
        .append("name", "Chris")
        .append("age", 25)
        .append("company", "UMM")
        .append("email", "chris@this.that"));
    testUsers.add(
      new Document()
        .append("name", "Pat")
        .append("age", 37)
        .append("company", "IBM")
        .append("email", "pat@something.com"));
    testUsers.add(
      new Document()
        .append("name", "Jamie")
        .append("age", 37)
        .append("company", "Frogs, Inc.")
        .append("email", "jamie@frogs.com"));

    userDocuments.insertMany(testUsers);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> users = new ArrayList<>();
    documents.into(users);
    return users;
  }

  private int countUsers(FindIterable<Document> documents) {
    List<Document> users = intoList(documents);
    return users.size();
  }

  @Test
  void shouldBeThreeUsers() {
    FindIterable<Document> documents = userDocuments.find();
    int numberOfUsers = countUsers(documents);
    assertEquals(3, numberOfUsers, "Should be 3 total users");
  }

  @Test
  void shouldBeOneChris() {
    FindIterable<Document> documents = userDocuments.find(eq("name", "Chris"));
    int numberOfUsers = countUsers(documents);
    assertEquals(1, numberOfUsers, "Should be 1 Chris");
  }

  @Test
  void shouldBeTwoOver25() {
    FindIterable<Document> documents = userDocuments.find(gt("age", 25));
    int numberOfUsers = countUsers(documents);
    assertEquals(2, numberOfUsers, "Should be 2 over 25");
  }

  @Test
  void over25SortedByName() {
    List<Document> docs
      = userDocuments.find(gt("age", 25))
      .sort(Sorts.ascending("name"))
      .into(new ArrayList<>());
    assertEquals(2, docs.size(), "Should be 2");
    assertEquals("Jamie", docs.get(0).get("name"), "First should be Jamie");
    assertEquals("Pat", docs.get(1).get("name"), "Second should be Pat");
  }

  @Test
  void over25AndIbmers() {
    List<Document> docs
      = userDocuments.find(and(gt("age", 25),
      eq("company", "IBM")))
      .into(new ArrayList<>());
    assertEquals(1, docs.size(), "Should be 1");
    assertEquals("Pat", docs.get(0).get("name"), "First should be Pat");
  }

  @Test
  void justNameAndEmail() {
    List<Document> docs
      = userDocuments.find().projection(fields(include("name", "email")))
      .into(new ArrayList<>());
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Chris", docs.get(0).get("name"), "First should be Chris");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("company"), "First shouldn't have 'company'");
    assertNotNull(docs.get(0).get("_id"), "First should have '_id'");
  }

  @Test
  void justNameAndEmailNoId() {
    List<Document> docs
      = userDocuments.find()
      .projection(fields(include("name", "email"), excludeId()))
      .into(new ArrayList<>());
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Chris", docs.get(0).get("name"), "First should be Chris");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("company"), "First shouldn't have 'company'");
    assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  }

  @Test
  void justNameAndEmailNoIdSortedByCompany() {
    List<Document> docs
      = userDocuments.find()
      .sort(Sorts.ascending("company"))
      .projection(fields(include("name", "email"), excludeId()))
      .into(new ArrayList<>());
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Jamie", docs.get(0).get("name"), "First should be Jamie");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("company"), "First shouldn't have 'company'");
    assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  }

  @Test
  void ageCounts() {
    List<Document> docs
      = userDocuments.aggregate(
      Arrays.asList(
        /*
         * Groups data by the "age" field, and then counts
         * the number of documents with each given age.
         * This creates a new "constructed document" that
         * has "age" as it's "_id", and the count as the
         * "ageCount" field.
         */
        Aggregates.group("$age",
          Accumulators.sum("ageCount", 1)),
        Aggregates.sort(Sorts.ascending("_id"))
      )
    ).into(new ArrayList<>()); //Attempts to coerce the resulting AggregateIterable object into an ArrayList.
    assertEquals(2, docs.size(), "Should be two distinct ages");
    assertEquals(25, docs.get(0).get("_id"));
    assertEquals(1, docs.get(0).get("ageCount"));
    assertEquals(37, docs.get(1).get("_id"));
    assertEquals(2, docs.get(1).get("ageCount"));
  }

  @Test
  void averageAge() {
    List<Document> docs
      = userDocuments.aggregate(
      Arrays.asList(
        Aggregates.group("$company",
          Accumulators.avg("averageAge", "$age")),
        Aggregates.sort(Sorts.ascending("_id"))
      )).into(new ArrayList<>());
    assertEquals(3, docs.size(), "Should be three companies");

    assertEquals("Frogs, Inc.", docs.get(0).get("_id"));
    assertEquals(37.0, docs.get(0).get("averageAge"));
    assertEquals("IBM", docs.get(1).get("_id"));
    assertEquals(37.0, docs.get(1).get("averageAge"));
    assertEquals("UMM", docs.get(2).get("_id"));
    assertEquals(25.0, docs.get(2).get("averageAge"));
  }

}
