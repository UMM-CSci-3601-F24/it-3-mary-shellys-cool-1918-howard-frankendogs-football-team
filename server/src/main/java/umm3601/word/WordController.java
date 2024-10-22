package umm3601.word;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
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

public class WordController implements Controller {

    private static final String API_WORDS = "/api/anagram";
    private static final String API_WORD_BY_ID = "/api/anagram/{id}";
    private static final String API_WORDS_BY_WORDGROUP = "/api/anagram/{wordGroup}";
    static final String WORD_KEY = "word";
    static final String WORD_GROUP_KEY = "wordGroup";
    static final String SORT_ORDER_KEY = "sortOrder";

    private final JacksonMongoCollection<Word> wordCollection;

    public WordController(MongoDatabase database) {
        wordCollection = JacksonMongoCollection.builder().build(
            database,
            "words",
            Word.class,
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

        ArrayList<Word> matchingWords = wordCollection
            .find(combinedFilter)
            .sort(sortingOrder)
            .into(new ArrayList<>());

        ctx.json(matchingWords);
        ctx.status(HttpStatus.OK);
    }

    private Bson constructFilter(Context ctx) {
        List<Bson> filters = new ArrayList<>();

        if (ctx.queryParamMap().containsKey(WORD_KEY)) {
          Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_KEY)), Pattern.CASE_INSENSITIVE);
          filters.add(regex(WORD_KEY, pattern));
        }

        if (ctx.queryParamMap().containsKey(WORD_GROUP_KEY)) {
          Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(WORD_GROUP_KEY)), Pattern.CASE_INSENSITIVE);
          filters.add(regex(WORD_GROUP_KEY, pattern));
        }

        Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

        return combinedFilter;
    }

private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortType"), "alphabetical");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortOrder"), "false");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
}


  public void addNewWord(Context ctx) {

    String body = ctx.body();
    Word newWord = ctx.bodyValidator(Word.class)
    .check(td -> td.word != null && td.word.length() > 0,
        "New words must be non-empty; New words was " + body)
    .check(td -> td.wordGroup != null && td.wordGroup.length() > 0,
        "Word Group must be non-empty; Group was " + body)
    // .check(td -> td.body != null && td.body.length() > 0,
    //     "Todo must have a non-empty body; body was " + body)
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
    // ctx passes wordGroup as the name of the group not the ids of the elements in group
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


  public void addRoutes(Javalin server) {

    server.get(API_WORDS, this::getWords);

    server.delete(API_WORD_BY_ID, this::deleteWord);

    server.post(API_WORDS, this::addNewWord);

    // server.post(API_WORDS, this::addListWords);

    server.delete(API_WORDS_BY_WORDGROUP, this::deleteListWords);
  }
}




