package umm3601.word;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
// import java.util.stream.Collectors;
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
class WordControllerSpec {
  private WordController wordController;
  private ObjectId wordId;
  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Word>> wordArrayListCaptor;

  @Captor
  private ArgumentCaptor<Word> wordCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
      String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

      mongoClient = MongoClients.create(
        MongoClientSettings.builder().applyToClusterSettings(builder ->
          builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

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

        wordController = new WordController(db);
    }

  @Test
  public void canBuildController() throws IOException {
      Javalin mockServer = Mockito.mock(Javalin.class);
      wordController.addRoutes(mockServer);
      //used to be :
      // verify(mockServer, Mockito.atLeast(2)).get(any(), any());
      //changed because only have one get function for wordController, reinstate if reinstate get words by group
      verify(mockServer, Mockito.atLeastOnce()).get(any(), any());
      verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
      verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

    @Test
    void canGetAllWords() throws IOException {
        when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());
        wordController.getWords(ctx);
        verify(ctx).json(wordArrayListCaptor.capture());
        verify(ctx).status(HttpStatus.OK);
        assertEquals(db.getCollection("words").countDocuments(), wordArrayListCaptor.getValue().size());
    }

  @Test
  void canGetTodosWithWordGroupBrainRot() throws IOException {
    String targetWordGroup = "brainrot";
    Map<String, List<String>> queryParams = new HashMap<>();

    queryParams.put(WordController.WORD_GROUP_KEY, Arrays.asList(new String[] {targetWordGroup}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(WordController.WORD_GROUP_KEY)).thenReturn(targetWordGroup);

    Validation validation = new Validation();
    Validator<String> validator = validation.validator(WordController.WORD_GROUP_KEY, String.class, targetWordGroup);

    when(ctx.queryParamAsClass(WordController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    wordController.getWords(ctx);

    verify(ctx).json(wordArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(3, wordArrayListCaptor.getValue().size());

    for (Word word : wordArrayListCaptor.getValue()) {
      assertEquals(targetWordGroup, word.wordGroup);
    }

    List<String> words = wordArrayListCaptor.getValue().stream().map(word -> word.word).collect(Collectors.toList());
    assertTrue(words.contains("skibbidy"));
    assertTrue(words.contains("sigma"));
    assertTrue(words.contains("cooked"));
  }

  @Test
    void canGetWord() throws IOException {
        String targetWord = "playstation";

        Map<String, List<String>> queryParams = new HashMap<>();

        queryParams.put(WordController.WORD_KEY, Arrays.asList(new String[] {targetWord}));
        when(ctx.queryParamMap()).thenReturn(queryParams);
        when(ctx.queryParam(WordController.WORD_KEY)).thenReturn(targetWord);

        Validation validation = new Validation();
        Validator<String> validator = validation.validator(WordController.WORD_KEY, String.class, targetWord);

        when(ctx.queryParamAsClass(WordController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

        wordController.getWords(ctx);

        verify(ctx).json(wordArrayListCaptor.capture());
        verify(ctx).status(HttpStatus.OK);

        assertEquals(1, wordArrayListCaptor.getValue().size());

        for (Word word : wordArrayListCaptor.getValue()) {
            assertTrue(word.word.contains("playstation"));
        }
    }

    // @Test
    // public void canGetString() {

    //     String targetWord = "skibbidy";
    //     String targetString = "make tests, import all words";

    //     Map<String, List<String>> queryParams = new HashMap<>();

    //     queryParams.put(WordController.WORD_KEY, Arrays.asList(new String[] {targetWord}));
    //     when(ctx.queryParamMap()).thenReturn(queryParams);
    //     when(ctx.queryParam(WordController.WORD_KEY)).thenReturn(targetWord);

    //     Validation validation = new Validation();
    //     Validator<String> validator = validation.validator(WordController.WORD_KEY, String.class, targetWord);

    //     when(ctx.queryParamAsClass(WordController.WORD_GROUP_KEY, String.class)).thenReturn(validator);

    //     wordController.getWords(ctx);

    //     verify(ctx).json(wordArrayListCaptor.capture());
    //     verify(ctx).status(HttpStatus.OK);

    //     assertEquals(1, wordArrayListCaptor.getValue().size());

    //     for (Word word : wordArrayListCaptor.getValue()) {
    //         assertTrue(word.toString().contains(targetString));
    //     }
    // }

  @Test
  public void getWordWithExistentId() throws IOException {
    String id = wordId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    wordController.getWord(ctx);

    verify(ctx).json(wordCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("janky", wordCaptor.getValue().word);
    assertEquals(wordId.toHexString(), wordCaptor.getValue()._id);
  }

  @Test
  public void getTodoWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      wordController.getWord(ctx);
    });

    assertEquals("The requested word id wasn't a legal Mongo Object ID", exception.getMessage());
  }

  @Test
  public void getWordWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      wordController.getWord(ctx);
    });

    assertEquals("The requested word was not found", exception.getMessage());
  }

  // @Test
  // void addWord() throws IOException {
  //   Word newWord = new Word();
  //   newWord.word = "computer";
  //   newWord.wordGroup = "technology";

  //   String newWordJson = javalinJackson.toJsonString(newWord, Word.class);

  //   when(ctx.bodyValidator(Word.class))
  //     .thenReturn(new BodyValidator<Word>(newWordJson, Word.class,
  //                   () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

  //   wordController.addNewWord(ctx);
  //   verify(ctx).json(mapCaptor.capture());

  //   verify(ctx).status(HttpStatus.CREATED);
  //   Document addedWord = db.getCollection("words")
  //       .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

  //   assertNotEquals("", addedWord.get("_id"));
  //   assertEquals(newWord.word, addedWord.get(WordController.WORD_KEY)); //("word"));
  //   assertEquals(newWord.wordGroup, addedWord.get("wordGroup")); //(WordController.WORD_GROUP_KEY));
  // }

  // @Test
  // void addWord() throws IOException {
  //   Word newWord = new Word();
  //   newWord.word = "computer";
  //   newWord.wordGroup = "technology";

  //   String newWordJson = javalinJackson.toJsonString(newWord, Word.class);

  //   when(ctx.bodyValidator(Word.class))
  //     .thenReturn(new BodyValidator<Word>(newWordJson, Word.class,
  //                   () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

  //   wordController.addNewWord(ctx);
  //   verify(ctx).json(mapCaptor.capture());

  //   verify(ctx).status(HttpStatus.CREATED);
  //   Document addedWord = db.getCollection("words")
  //       .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

  //   assertNotEquals("", addedWord.get("_id"));
  //   assertEquals(newWord.word, addedWord.get(WordController.WORD_KEY)); //("word"));
  //   assertEquals(newWord.wordGroup, addedWord.get("wordGroup")); //(WordController.WORD_GROUP_KEY));
  // }

  @Test
  void addWord2() throws IOException {
    Word newWord = new Word();
    newWord.word = "computer, tablet, phone";
    newWord.wordGroup = "technology";

    String newWordJson = javalinJackson.toJsonString(newWord, Word.class);

    when(ctx.bodyValidator(Word.class))
      .thenReturn(new BodyValidator<Word>(newWordJson, Word.class,
                    () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

    wordController.addNewWord(ctx);
    verify(ctx).json(mapCaptor.capture());
    verify(ctx).status(HttpStatus.CREATED);
    System.out.println(mapCaptor.getValue().toString());
    String addedWords = mapCaptor.getValue().toString();

    // assertTrue(addedWords.contains("6723f4872a8cf862c1cc5976"));
    // assertTrue(addedWords.contains("6723f4872a8cf862c1cc5977"));
    // assertTrue(addedWords.contains("6723f4872a8cf862c1cc5978"));

    // Document addedWords = db.getCollection("words")
    //     .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id"))));

    // assertNotEquals("", addedWord.get("_id"));
    // assertEquals(newWord.word, addedWord.get(WordController.WORD_KEY)); //("word"));
    // assertEquals(newWord.wordGroup, addedWord.get("wordGroup")); //(WordController.WORD_GROUP_KEY));
  }


//   @Test
//   void addMultipleWords() throws IOException {
//     String words = "apple, banana, cherry";
//     String wordGroup = "fruits";

//     when(ctx.body()).thenReturn(words);
//     when(ctx.queryParam("wordGroup")).thenReturn(wordGroup);

//     wordController.addMultipleWords(ctx);

//     verify(ctx).json(mapCaptor.capture());
//     verify(ctx).status(HttpStatus.CREATED);
//     assertEquals(3, mapCaptor.getValue().get("insertedCount"));

//     List<Document> addedWords = db.getCollection("words").find(eq("wordGroup", wordGroup)).into(new ArrayList<>());
//     assertEquals(3, addedWords.size());

//     List<String> addedWordsList = addedWords.stream().map(doc -> doc.getString("word")).collect(Collectors.toList());
//     assertTrue(addedWordsList.contains("apple"));
//     assertTrue(addedWordsList.contains("banana"));
//     assertTrue(addedWordsList.contains("cherry"));

//     for (Document doc : addedWords) {
//         assertEquals(wordGroup, doc.getString("wordGroup"));
//     }
// }

// @Test
// void addMultipleWordsWithBadWordGroup() throws IOException {
//     String words = "apple, banana, cherry";

//     when(ctx.body()).thenReturn(words);
//     when(ctx.queryParam("wordGroup")).thenReturn(null);

//     BadRequestResponse exception = assertThrows(BadRequestResponse.class, () -> {
//         wordController.addMultipleWords(ctx);
//     });

//     assertEquals("Word group must be provided and non-empty.", exception.getMessage());

//     assertEquals(0, db.getCollection("words").countDocuments(eq("wordGroup", null)));
// }



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
      wordController.addNewWord(ctx);
    });

    String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();

    assertTrue(exceptionMessage.contains("New words must be non-empty"));
  }

  @Test
  void addBadWordWordGroup() throws IOException {
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
          wordController.addNewWord(ctx);
        });

        String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();

        assertTrue(exceptionMessage.contains("Word Group must be non-empty"));
  }

  // @Test
  // void addBadWordWordGroupNull() throws IOException {
  //   String newWordJson = """
  //       {
  //       "word": "burger",
  //       "wordGroup": null,
  //       }
  //       """;

  //       when(ctx.body()).thenReturn(newWordJson);
  //       when(ctx.bodyValidator(Word.class))
  //         .then(value -> new BodyValidator<Word>(newWordJson, Word.class,
  //           () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

  //       ValidationException exception = assertThrows(ValidationException.class, () -> {
  //         wordController.addNewWord(ctx);
  //       });

  //       String exceptionMessage = exception.getErrors().get("REQUEST_BODY").get(0).toString();

  //       assertTrue(exceptionMessage.contains("Word Group must be non-empty"));
  // }


  //   String newWordJson = javalinJackson.toJsonString(newWord, Word.class);
  //   when(ctx.bodyValidator(Word.class))
  //     .thenReturn(new BodyValidator<Word>(newWordJson, Word.class,
  //                   () -> javalinJackson.fromJsonString(newWordJson, Word.class)));

  //   wordController.addNewWord(ctx);
  //   verify(ctx).json(mapCaptor.capture());

  //   verify(ctx).status(HttpStatus.CREATED);
  //   Document addedWord = db.getCollection("words")
  //       .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

  //   assertNotEquals("", addedWord.get("_id"));
  //   assertEquals(newWord.word, addedWord.get("word"));
  //   assertEquals(newWord.wordGroup, addedWord.get(WordController.WORD_GROUP_KEY));
  // }


  @Test
  void deleteFoundWord() throws IOException {
    String testID = wordId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    assertEquals(1, db.getCollection("words")
      .countDocuments(eq("_id", new ObjectId(testID))));

    wordController.deleteWord(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("words")
      .countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void deleteNotFoundWord() throws IOException {
    String testID = wordId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    wordController.deleteWord(ctx);

    assertEquals(0, db.getCollection("words")
      .countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      wordController.deleteWord(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);

    assertEquals(0, db.getCollection("words")
      .countDocuments(eq("_id", new ObjectId(testID))));
  }



@Test
void deleteListWords() throws IOException {
    String testWordGroup = "testGroup";
    db.getCollection("words").insertMany(Arrays.asList(
        new Document().append("word", "word1").append("wordGroup", testWordGroup),
        new Document().append("word", "word2").append("wordGroup", testWordGroup),
        new Document().append("word", "word3").append("wordGroup", "otherGroup") // This shouldn't be deleted
    ));
    assertEquals(2, db.getCollection("words")
      .countDocuments(eq("wordGroup", testWordGroup)));
    when(ctx.pathParam("wordGroup")).thenReturn(testWordGroup);
    wordController.deleteListWords(ctx);
    verify(ctx).status(HttpStatus.OK);
    assertEquals(0, db.getCollection("words")
      .countDocuments(eq("wordGroup", testWordGroup)));
    assertEquals(1, db.getCollection("words")
      .countDocuments(eq("wordGroup", "otherGroup")));
}

}







