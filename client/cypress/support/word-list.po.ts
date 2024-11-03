export class WordListPage {
  private readonly baseUrl = '/anagram';
  private readonly pageTitle = '.word-list-title';
  private readonly addWordButtonSelector = '[data-test=addWordButton]';
  private readonly anagramListItemsSelectorWords = '.anagram-nav-list-words .anagram-list-item'
  private readonly anagramListItemsSelectorHistory = ".anagram-nav-list-history .anagram-list-item"
  private readonly snackBar = '.mat-mdc-simple-snack-bar';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getAnagramTitle() {
    return cy.get(this.pageTitle);
  }

  addWordButton() {
    return cy.get(this.addWordButtonSelector);
  }

  getAnagramListItems() {
    return cy.get(this.anagramListItemsSelectorWords)
  }

  getAnagramSearchHistory() {
    return cy.get(this.anagramListItemsSelectorHistory)
  }

  getSnackBar() {
    // Since snackbars are often shown in response to errors,
    // we'll add a timeout of 10 seconds to help increase the likelihood that
    // the snackbar becomes visible before we might fail because it
    // hasn't (yet) appeared.
    return cy.get(this.snackBar, { timeout: 10000 });
  }

}
