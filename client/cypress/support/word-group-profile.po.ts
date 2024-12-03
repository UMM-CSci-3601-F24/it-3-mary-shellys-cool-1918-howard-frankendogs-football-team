export class WordGroupProfilePage {
  private readonly baseUrl = "/anagram/wordGroup/10000 Common Words";

  navigateTo() {
    return cy.visit(this.baseUrl);
  }
  getPageTitle() {
    return cy.get(".word-group-title mat-card-title")
  }
  getPageSubtitle() {
    return cy.get(".word-group-title mat-card-subtitle")
  }
  getWordGroupListItems() {
    return cy.get(".word-group-list .word-group-list-item");
  }
}
