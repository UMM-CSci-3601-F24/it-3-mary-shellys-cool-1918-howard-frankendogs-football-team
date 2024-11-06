import { Word } from 'src/app/anagram/word';

export class AddWordPage {
  private readonly url = '/anagram/new';
  private readonly title = '.add-word-title';
  private readonly button = '[data-test=confirmAddWordButton]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  private readonly wordFieldName = 'word';
  private readonly wordGroupFieldName = 'wordGroup';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly dropDownSelector = `mat-option`;

  navigateTo() {
    return cy.visit(this.url);
  }
  getTitle() {
    return cy.get(this.title);
  }
  addWordButton() {
    return cy.get(this.button);
  }
  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }
  getSnackBar() {
    return cy.get(this.snackBar, {timeout: 10000});
  }
  addWord(newWord: Word) {
    this.getFormField(this.wordFieldName).type(newWord.word);
    this.getFormField(this.wordGroupFieldName).type(newWord.wordGroup);
    return this.addWordButton().click();
  }
}
