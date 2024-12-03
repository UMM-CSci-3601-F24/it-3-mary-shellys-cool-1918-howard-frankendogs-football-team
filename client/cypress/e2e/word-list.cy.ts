import { WordListPage } from "cypress/support/word-list.po";

const page = new WordListPage();

describe('Anagram Solver', () => {

  before(() => {
    cy.task('seed:database');
  })

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getAnagramTitle().should('have.text', 'Anagram Generator');
  });

  it('Should show 5 words', () => {
    page.getAnagramListItems().should('have.length.at.least', 5);
  });

  it('should type something into the contains filter and check that elements returned are correct', () => {
    cy.get('[data-test=wordContainsInput]').type('can',{ force: true });
    page.getAnagramListItems().each( e => {
      cy.wrap(e).find('.anagram-list-word').should('include.text', 'a');
      cy.wrap(e).find('.anagram-list-word').should('include.text', 'n');
      cy.wrap(e).find('.anagram-list-word').should('include.text', 'c');
    });
  });

  it('should type something into the wordGroup filter and check that elements returned are correct', () => {
    cy.get('[data-test=wordGroupInput]').type('1000',{ force: true });
    page.getAnagramListItems().each( e => {
      cy.wrap(e).find('.anagram-list-wordGroup').contains('10000 Common Words', {matchCase: false});
    });
  });

  it('should make a search and show search in search history', () => {
    cy.get('[data-test=wordGroupInput]').type('2005',{ force: true });
    cy.get('[data-test=wordContainsInput]').type('year',{ force: true });
    cy.get('.anagram-search-history-contains').first().should('include.text', 'year');
    cy.get('.anagram-search-history-wordGroup').first().should('include.text', '2005');
  });

  it('should click add word group and go to right url', () => {
    page.addWordButton().click();
    cy.url().should(url => expect(url.endsWith('/anagram/new')).to.be.true);
    cy.get('.add-word-title').should('have.text', 'New Word Group');
  });

  it("should click button for word group and go to right url", () => {
    page.wordGroupProfileButton().first().click();
    cy.url().should(url => expect(url.includes('/anagram/wordGroup/10000%20Common%20Words')).to.be.true);
    cy.get('.word-group-title mat-card-title').should('contain.text', 'Group Name:');
  });

  it('should open the expansion panel for a word and then delete it', () => {
    cy.get('[data-cy=expansion-panel-header]').first().click();
    cy.get('[data-cy=expansion-panel-header]').should('be.visible', {first: true});

    cy.get('[data-cy=expansion-panel-header]').first().within(() => {
      cy.get('[data-test=deleteWordButton]').click();
    });

    cy.get('simple-snack-bar').contains('We deleted a word!', { matchCase: false });
  });

  it('should expand the panel when clicked', () => {
    cy.get('#mat-expansion-panel-header-0 > .mat-expansion-indicator');
    cy.get('[data-cy=expansion-panel-header]').should('be.visible', {first: true});
  });
});
