import { WordGroupProfilePage } from "cypress/support/word-group-profile.po";

describe("word group profile page", () => {
  const page = new WordGroupProfilePage();

  before(() => {
    cy.task('seed:database');
  })

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getPageTitle().should('contain.text', 'Group Name:');
  });

  it("should have 100 words on page on first load of 10,000 word group page", () => {
    page.getPageSubtitle().should('have.text', "Number of words: 10000");
    page.getWordGroupListItems().should("have.length", 100);
  });
})
