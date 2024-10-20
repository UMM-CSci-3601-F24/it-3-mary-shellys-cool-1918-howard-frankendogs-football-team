export interface Word {
  /* MongoDB requires an id, ideally this should be the word itself because 
   we want them to be unique words, but this should not be implemented before 
   talking about cases of being in multiple word groups
  */
  _id: string;
  wordGroup: string;
  word: string;

  // future implementations
  // definition: string;
  // PartSpeech: string;
}
