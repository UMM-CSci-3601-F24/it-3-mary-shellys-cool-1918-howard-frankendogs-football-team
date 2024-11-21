package umm3601.word;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class AnagramController implements Controller {

  private static final String API_WORDS = "/api/anagram";
  private static final String API_WORD_BY_ID = "/api/anagram/{id}";
  private static final String API_WORDS_BY_WORDGROUP = "/api/anagram/{wordGroup}";
  private static final String API_WORDS_SEARCH_HISTORY = "/api/anagram/history";
  static final String WORD_KEY = "word";
  static final String WORD_GROUP_KEY = "wordGroup";
  static final String SORT_ORDER_KEY = "sortOrder";
  static final String FILTER_TYPE_KEY = "filterType";

  private final JacksonMongoCollection<Search> searchCollection;
  private final JacksonMongoCollection<Word> wordCollection;

  public AnagramController(MongoDatabase database) {
    wordCollection = JacksonMongoCollection.builder().build(
        database,
        "words",
        Word.class,
        UuidRepresentation.STANDARD);
    searchCollection = JacksonMongoCollection.builder().build(
        database,
        "searches",
        Search.class,
        UuidRepresentation.STANDARD);
  }

  public void getWord(Context ctx) {
    String id = ctx.pathParam("id");
    Word word;

    try {
      word = wordCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested word id wasn't a legal Mongo Object ID");
    }
    if (word == null) {
      throw new NotFoundResponse("The requested word was not found");
    } else {
      ctx.json(word);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getWords(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // take words and searches from db and put into array lists
    ArrayList<Word> matchingWords = wordCollection
        .find(combinedFilter)
        .sort(sortingOrder)
        .into(new ArrayList<>());
    ArrayList<Search> searches = searchCollection.find().into(new ArrayList<>());
    // turn array lists into SearchContext and return
    SearchContext results = new SearchContext(matchingWords, searches);
    ctx.json(results);
    ctx.status(HttpStatus.OK);
  }

  Bson constructFilter(Context ctx) {
    // names data to be logged
    List<Bson> filters = new ArrayList<>();
    Search newSearch = new Search();
    String filterType = ctx.queryParam(FILTER_TYPE_KEY);
    String searchedWord = ctx.queryParam(WORD_KEY);
    Map<Character, Integer> charCountMap = new HashMap<>();

  // if searching for contains will enter this loop
    if (ctx.queryParamMap().containsKey(WORD_KEY)) {
      if ("exact".equals(filterType) && ctx.queryParamMap().containsKey(WORD_KEY)) {
        //if filter type is exact it runs following code
          String exactWord = ctx.queryParam(WORD_KEY).replace('_', '.');
          //Because . are wildcards, replaces underscores with periods
          Pattern pattern = Pattern.compile(exactWord, Pattern.CASE_INSENSITIVE); //makes a pattern
          filters.add(regex(WORD_KEY, pattern)); //adds a regex with
          newSearch.setContains(ctx.queryParam(WORD_KEY));
        } else if ("contains".equals(filterType) && ctx.queryParamMap().containsKey(WORD_KEY)) {
            for (char c : searchedWord.toCharArray()) {
              charCountMap.put(c, charCountMap.getOrDefault(c, 0) + 1);
          }
          for (Map.Entry<Character, Integer> entry : charCountMap.entrySet()) {
            char c = entry.getKey();
            int count = entry.getValue();
            String regexPattern = "(?i)(.*" + Pattern.quote(String.valueOf(c)) + ".*){" + count + "}";
            filters.add(regex("word", Pattern.compile(regexPattern)));
        }
    }
  }

    // if searching by word group will enter this loop

    if (ctx.queryParamMap().containsKey(WORD_GROUP_KEY)) {
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_GROUP_KEY)), Pattern.CASE_INSENSITIVE);
      filters.add(regex(WORD_GROUP_KEY, pattern));
      newSearch.setWordGroup(ctx.queryParam(WORD_GROUP_KEY));
    }
    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);
    // log into database
    if ((ctx.queryParam(WORD_KEY) != null && ctx.queryParam(WORD_KEY) != "")
        || (ctx.queryParam(WORD_GROUP_KEY) != null && ctx.queryParam(WORD_GROUP_KEY) != "")) {
      searchCollection.insertOne(newSearch);
      System.err.println("search added to db with params: " + combinedFilter.toString());
    }
    // return filter to be applied to db in getWords()
    return combinedFilter;
  }

  //used for debugging setting up db, might be used again for debugging limiting saved searches
  // public void getSearches(Context ctx) {
  //   ArrayList<Search> searches = searchCollection.find().into(new ArrayList<>());
  //   ctx.json(searches);
  //   ctx.status(HttpStatus.OK);
  // }

  private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortType"), "word");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortOrder"), "false");

    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
}

  public void addNewWord(Context ctx) {

    String body = ctx.body();
    Word newWord = ctx.bodyValidator(Word.class)
        .check(nw -> nw.word != null && nw.word.length() > 0,
            "New words must be non-empty and not null; body was " + body)
        .check(nw -> nw.wordGroup != null && nw.wordGroup.length() > 0,
            "Word group must be non-empty and not null; body was " + body)
        .get();

    wordCollection.insertOne(newWord);
    ctx.json(Map.of("id", newWord._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void deleteWord(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = wordCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }

  public void deleteListWords(Context ctx) {
    // ctx passes wordGroup as the name of the group not the ids of the elements in
    // group
    String deleteWordGroup = ctx.pathParam("wordGroup");
    DeleteResult deleteResult = wordCollection.deleteMany(eq("wordGroup", deleteWordGroup));

    if (deleteResult.getDeletedCount() == 0) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
          "Was unable to delete word group "
              + deleteWordGroup
              + "; perhaps illegal word group or no items found in the system?");
    }
    ctx.status(HttpStatus.OK);
  }

  @Override
  public void addRoutes(Javalin server) {

    server.get(API_WORDS, this::getWords);

    // server.get(API_WORDS_SEARCH_HISTORY, this::getSearches);

    server.delete(API_WORD_BY_ID, this::deleteWord);

    server.post(API_WORDS, this::addNewWord);

    // server.post(API_WORDS, this::addListWords);

    server.delete(API_WORDS_BY_WORDGROUP, this::deleteListWords);
  }
}
