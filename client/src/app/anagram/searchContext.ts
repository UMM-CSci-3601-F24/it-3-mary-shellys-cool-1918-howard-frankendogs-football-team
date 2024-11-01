import { Search } from "./search";
import { Word } from "./word";

export interface SearchContext {
  words: Word[];
  searches: Search[];
}

