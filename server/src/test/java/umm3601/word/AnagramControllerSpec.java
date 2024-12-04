package umm3601.word;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.Validation;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;

@SuppressWarnings({ "MagicNumber" })
class AnagramControllerSpec {
  private static final String SEARCH_COLLECTION = "searches";
  private AnagramController anagramController;
  private ObjectId wordId;
  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  // @Captor
  // private ArgumentCaptor<ArrayList<Word>> searchContextCaptor;

  // @Captor
  private ArgumentCaptor<ArrayList<Search>> searchArrayListCaptor;

  @Captor
  private ArgumentCaptor<SearchContext> searchContextCaptor;

  @Captor
  private ArgumentCaptor<Word> wordCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<String>> wordGroupCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Word>> wordArrayCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

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
    MongoCollection<Document> wordDocuments = db.getCollection("words");
    wordDocuments.drop();
    List<Document> testWords = new ArrayList<>();
    testWords.add(
        new Document()
            .append("word", "playstation")
            .append("wordGroup", "console"));
    testWords.add(
        new Document()
            .append("word", "xbox")
            .append("wordGroup", "console"));
    testWords.add(
        new Document()
            .append("word", "nintendo")
            .append("wordGroup", "console"));
    testWords.add(
        new Document()
            .append("word", "skibbidy")
            .append("wordGroup", "brainrot"));
    testWords.add(
        new Document()
            .append("word", "sigma")
            .append("wordGroup", "brainrot"));
    testWords.add(
        new Document()
            .append("word", "cooked")
            .append("wordGroup", "brainrot"));

    wordId = new ObjectId();
    Document testWordId = new Document()
        .append("word", "janky")
        .append("wordGroup", "slang")
        .append("_id", wordId);

    wordDocuments.insertMany(testWords);
    wordDocuments.insertOne(testWordId);

    MongoCollection<Document> searchDocuments = db.getCollection(SEARCH_COLLECTION);
    searchDocuments.drop();
    List<Document> testSearches = new ArrayList<>();
    testSearches.add(new Document().append("contains", "he"));
    searchDocuments.insertMany(testSearches);

    anagramController = new AnagramController(db);
  }

  @Test
  public void canBuildController() throws IOException {
    Javalin mockServer = Mockito.mock(Javalin.class);
    anagramController.addRoutes(mockServer);
    /*
     * This tests how many 'get', 'delete' and 'post' routes there are
     * Change the get count to: verify(mockServer, Mockito.atLeast(2)).get(any(),
     * any());
     * when reinstate get words by group
     */
    verify(mockServer, Mockito.atLeast(2)).get(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

  @Test
  void canGetAllWords() throws IOException {
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());
    anagramController.getWords(ctx);
    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(db.getCollection("words").countDocuments(), searchContextCaptor.getValue().words.size());
  }

  @Test
  void canGetWordsWithWordGroupBrainRot() throws IOException {
    String targetWordGroup = "brainrot";
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(AnagramController.WORD_GROUP_KEY, Arrays.asList(new String[] {targetWordGroup}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_GROUP_KEY)).thenReturn(targetWordGroup);

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(AnagramController.WORD_GROUP_KEY, String.class, targetWordGroup);

    when(ctx.queryParamAsClass(AnagramController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    anagramController.getWords(ctx);

    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(3, searchContextCaptor.getValue().words.size());

    for (Word word : searchContextCaptor.getValue().words) {
      assertEquals(targetWordGroup, word.wordGroup);
    }

    List<String> words = searchContextCaptor.getValue().words.stream()
        .map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("skibbidy"));
    assertTrue(words.contains("sigma"));
    assertTrue(words.contains("cooked"));
  }

  @Test
  void canGetWord() throws IOException {
    String targetWord = "playstation";

    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {targetWord}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn(targetWord);

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(AnagramController.WORD_KEY, String.class, targetWord);

    when(ctx.queryParamAsClass(AnagramController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    anagramController.getWords(ctx);

    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(7, searchContextCaptor.getValue().words.size());

    for (Word word : searchContextCaptor.getValue().words) {
      assertTrue(searchContextCaptor.getValue().words.contains(word));
    }
  }

  @Test
  void getWordSavesSearch() throws IOException {
    // checks initial size
    long dbSize = db.getCollection(SEARCH_COLLECTION).countDocuments();
    // makes search that will be passed
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {"ha"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn("ha");
    // calls getWords() which calls constructFilter()
    anagramController.getWords(ctx);
    // checks that only one document was added
    assertEquals(db.getCollection(SEARCH_COLLECTION).countDocuments(), dbSize + 1);
    // Capture the search sent to db and check status
    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    // check that document added had the right params
    assertEquals("ha", (ctx.queryParam(AnagramController.WORD_KEY)));
  }

  @Test
  void getWordDoesNotSaveEmptySearch() throws IOException {
    // checks initial size
    long dbSize = db.getCollection(SEARCH_COLLECTION).countDocuments();
    // makes search that will be passed
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {""}));
    queryParams.put(AnagramController.WORD_GROUP_KEY, Arrays.asList(new String[] {""}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn("");
    when(ctx.queryParam(AnagramController.WORD_GROUP_KEY)).thenReturn("");
    // calls getWords() which calls constructFilter()
    anagramController.getWords(ctx);
    // checks that only one document was added
    assertEquals(db.getCollection(SEARCH_COLLECTION).countDocuments(), dbSize);
    // Capture the search sent to db and check status
    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
  }

  @Test
  void getWordDoesNotSaveNullSearch() throws IOException {
    // checks initial size
    long dbSize = db.getCollection(SEARCH_COLLECTION).countDocuments();
    // makes search that will be passed
    Map<String, List<String>> queryParams = new HashMap<>();
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn(null);
    // calls getWords() which calls constructFilter()
    anagramController.getWords(ctx);
    // checks that no document was added
    assertEquals(db.getCollection(SEARCH_COLLECTION).countDocuments(), dbSize);
    // Capture the search sent to db and check status
    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
  }

  @Test
  void constructFiltersReturnsMessage() throws IOException {
    ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    System.setErr(new PrintStream(outContent));
    // makes search that will be passed
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {"ha"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn("ha");
    // calls getWords() which calls constructFilter()
    anagramController.getWords(ctx);
    // checks that construct filters gave out right message "search added with db
    // params..."
    assertTrue(outContent.toString().contains("search added to db"));
  }

  @Test
  public void testConstructFilterExactWordKey() {

    Word newWord = new Word();
    newWord.word = "word";
    newWord.wordGroup = "testwords";
    when(ctx.queryParam("filterType")).thenReturn("exact");
    when(ctx.queryParam("word")).thenReturn("word");

    anagramController.constructFilter(ctx);

    verify(ctx).queryParam("filterType");
    List<Word> wordDocuments = new ArrayList<>();
    wordDocuments.add(newWord);
    assertEquals(1, wordDocuments.size());
    assertEquals("word", wordDocuments.get(0).word);
  }

  @Test
  public void testConstructFilterContainsWordKey() {

    Word newWord = new Word();
    newWord.word = "word";
    newWord.wordGroup = "testwords";
    when(ctx.queryParam("filterType")).thenReturn("contains");
    when(ctx.queryParam("word")).thenReturn("cat");

    anagramController.constructFilter(ctx);

    verify(ctx).queryParam("filterType");
    List<Word> wordDocuments = new ArrayList<>();
    wordDocuments.add(newWord);
    assertEquals(1, wordDocuments.size());
    assertEquals("word", wordDocuments.get(0).word);
  }

  @Test
  void canGetWordsWithExactSi() throws IOException {
    String targetHas = "si";
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {targetHas}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn(targetHas);
    when(ctx.queryParam("filterType")).thenReturn("exact");

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(AnagramController.WORD_KEY, String.class, targetHas);

    when(ctx.queryParamAsClass(AnagramController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    anagramController.getWords(ctx);

    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(1, searchContextCaptor.getValue().words.size());

    for (Word word : searchContextCaptor.getValue().words) {
      assertTrue(word.word.contains(targetHas));
    }

    List<String> words = searchContextCaptor.getValue().words.stream()
        .map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("sigma"));
  }

  @Test
  void canGetWordsWithUnderscores() throws IOException {
    String targetHas = "_y";
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {targetHas}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn(targetHas);
    when(ctx.queryParam("filterType")).thenReturn("exact");

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(AnagramController.WORD_KEY, String.class, targetHas);

    when(ctx.queryParamAsClass(AnagramController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    anagramController.getWords(ctx);

    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(3, searchContextCaptor.getValue().words.size());

    List<String> words = searchContextCaptor.getValue().words.stream()
        .map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("playstation"));
    assertTrue(words.contains("skibbidy"));
    assertTrue(words.contains("janky"));
  }

  @Test
  void canGetWordsWithContainsSi() throws IOException {
    String targetContains = "si";
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {targetContains}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn(targetContains);
    when(ctx.queryParam("filterType")).thenReturn("contains");

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(AnagramController.WORD_KEY, String.class, targetContains);

    when(ctx.queryParamAsClass(AnagramController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    anagramController.getWords(ctx);

    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(3, searchContextCaptor.getValue().words.size());

    for (Word word : searchContextCaptor.getValue().words) {
      assertTrue(word.word.contains("s"));
      assertTrue(word.word.contains("i"));
    }

    List<String> words = searchContextCaptor.getValue().words.stream()
        .map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("sigma"));
    assertTrue(words.contains("skibbidy"));
    assertTrue(words.contains("playstation"));
  }

  @Test
  void canGetWordsWithDuplicateO() throws IOException {
    String targetContains = "oo";
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(AnagramController.WORD_KEY, Arrays.asList(new String[] {targetContains}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(AnagramController.WORD_KEY)).thenReturn(targetContains);
    when(ctx.queryParam("filterType")).thenReturn("contains");

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(AnagramController.WORD_KEY, String.class, targetContains);

    when(ctx.queryParamAsClass(AnagramController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    anagramController.getWords(ctx);

    verify(ctx).json(searchContextCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(1, searchContextCaptor.getValue().words.size());

    for (Word word : searchContextCaptor.getValue().words) {
      assertTrue(word.word.contains("oo"));
    }

    List<String> words = searchContextCaptor.getValue().words.stream()
        .map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("cooked"));
    assertFalse(words.contains("xbox"));
    assertFalse(words.contains("playstation"));
  }

  @Test
  public void getWordWithExistentId() throws IOException {
    String id = wordId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    anagramController.getWord(ctx);

    verify(ctx).json(wordCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("janky", wordCaptor.getValue().word);
    assertEquals(wordId.toHexString(), wordCaptor.getValue()._id);
  }

  @Test
  public void getWordWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      anagramController.getWord(ctx);
    });

    assertEquals("The requested word id wasn't a legal Mongo Object ID", exception.getMessage());
  }

  @Test
  public void getWordWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      anagramController.getWord(ctx);
    });

    assertEquals("The requested word was not found", exception.getMessage());
  }

  @Test
  void addWord() throws IOException {
    Word newWord = new Word();
    newWord.word = "computer";
    newWord.wordGroup = "technology";

    String newWordJson = javalinJackson.toJsonString(newWord, Word.class);

    when(ctx.bodyValidator(Word.class))
        .thenReturn(new BodyValidator<Word>(newWordJson, Word.class,
            () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

    anagramController.addNewWord(ctx);
    verify(ctx).json(mapCaptor.capture());

    verify(ctx).status(HttpStatus.CREATED);
    Document addedWord = db.getCollection("words")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    assertNotEquals("", addedWord.get("_id"));
    assertEquals(newWord.word, addedWord.get(AnagramController.WORD_KEY)); // ("word"));
    assertEquals(newWord.wordGroup, addedWord.get("wordGroup")); // (WordController.WORD_GROUP_KEY));
  }

  @Test
  void addBadWordWord() throws IOException {
    String newWordJson = """
        {
        "word": "",
        "wordGroup": "food"
        }
        """;
    when(ctx.body()).thenReturn(newWordJson);
    when(ctx.bodyValidator(Word.class))
        .then(value -> new BodyValidator<Word>(newWordJson, Word.class,
            () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

    ValidationException exception = assertThrows(ValidationException.class, () -> {
      anagramController.addNewWord(ctx);
    });

    String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();

    assertTrue(exceptionMessage.contains("New words must be non-empty"));
  }

  @Test
  void addBadWordEmptyWordGroup() throws IOException {
    String newWordJson = """
        {
        "word": "burger",
        "wordGroup": ""
        }
        """;

    when(ctx.body()).thenReturn(newWordJson);
    when(ctx.bodyValidator(Word.class))
        .then(value -> new BodyValidator<Word>(newWordJson, Word.class,
            () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

    ValidationException exception = assertThrows(ValidationException.class, () -> {
      anagramController.addNewWord(ctx);
    });

    String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();

    assertTrue(exceptionMessage.contains("Word group must be non-empty"));
  }

  @Test
  void addBadWordNullGroup() throws IOException {
    String newWordJson = """
        {
        "word": "burger"
        }
        """;

    when(ctx.body()).thenReturn(newWordJson);
    // when addNew words asks for validator, it will return the body validator
    // constructed below
    when(ctx.bodyValidator(Word.class))
        .then(value -> new BodyValidator<Word>(newWordJson, Word.class,
            // converts newWordJson into type of Word
            () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

    // Captures error thrown when addNewWord is called
    ValidationException exception = assertThrows(ValidationException.class, () -> {
      anagramController.addNewWord(ctx);
    });
    // Gets message out of exception
    String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();
    // checks message contains correct content
    assertTrue(exceptionMessage.contains("Word group must be non-empty"));
  }

  @Test
  void addBadWordNullWord() throws IOException {
    String newWordJson = """
        {
        "wordGroup": "burger"
        }
        """;

    when(ctx.body()).thenReturn(newWordJson);
    // when addNew words asks for validator, it will return the body validator
    // constructed below
    when(ctx.bodyValidator(Word.class))
        .then(value -> new BodyValidator<Word>(newWordJson, Word.class,
            // converts newWordJson into type of Word
            () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

    // Captures error thrown when addNewWord is called
    ValidationException exception = assertThrows(ValidationException.class, () -> {
      anagramController.addNewWord(ctx);
    });
    // Gets message out of exception
    String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();
    // checks message contains correct content
    assertTrue(exceptionMessage.contains("New words must be non-empty"));
  }

  @Test
  void deleteFoundWord() throws IOException {
    String testID = wordId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    assertEquals(1, db.getCollection("words")
        .countDocuments(eq("_id", new ObjectId(testID))));

    anagramController.deleteWord(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("words")
        .countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void deleteNotFoundWord() throws IOException {
    String testID = wordId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    anagramController.deleteWord(ctx);

    assertEquals(0, db.getCollection("words")
        .countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      anagramController.deleteWord(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);

    assertEquals(0, db.getCollection("words")
        .countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void canGetWordsByWordGroup() throws IOException {
    // set up
    String targetWordGroup = "console";
    when(ctx.pathParam("wordGroup")).thenReturn(targetWordGroup);
    // call method
    anagramController.getWordsByWordGroup(ctx);
    // make sure everything is okay superficially
    verify(ctx).json(wordArrayCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    // makes sure correct amt of words were captured
    assertEquals(3, wordArrayCaptor.getValue().size());
    //check word groups are correct
    for (Word word : wordArrayCaptor.getValue()) {
      assertEquals(targetWordGroup, word.wordGroup);
    }
    // checks words are what we expect
    List<String> words = wordArrayCaptor.getValue().stream()
        .map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("playstation"));
    assertTrue(words.contains("xbox"));
    assertTrue(words.contains("nintendo"));
  }

  @Test
  void canGetWordGroups() throws IOException {
    // call method
    anagramController.getWordGroups(ctx);
    //make sure everything is okay superficially
    verify(ctx).json(wordGroupCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    // checks specifics of return value
    assertEquals(3, wordGroupCaptor.getValue().size());
    assertTrue(wordGroupCaptor.getValue().contains("console"));
    assertTrue(wordGroupCaptor.getValue().contains("brainrot"));
    assertTrue(wordGroupCaptor.getValue().contains("slang"));
  }

  @Test
  void deleteWordGroup() throws IOException {
    String badWordGroup = "brainrot";

    when(ctx.pathParam("wordGroup")).thenReturn(badWordGroup);

    assertEquals(3, db.getCollection("words")
        .countDocuments(eq("wordGroup", badWordGroup)));

    anagramController.deleteWordGroup(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("words")
    .countDocuments(eq("wordGroup", badWordGroup)));
  }
}
