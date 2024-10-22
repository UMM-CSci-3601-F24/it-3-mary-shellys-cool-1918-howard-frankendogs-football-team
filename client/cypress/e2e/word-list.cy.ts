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
    cy.get('[data-test=wordContainsInput]').type('ca');
    page.getAnagramListItems().each( e => {
      cy.wrap(e).find('.anagram-list-word').should('include.text', 'a');
      cy.wrap(e).find('.anagram-list-word').should('include.text', 'c');
    });
  });

  it('should type something into the wordGroup filter and check that elements returned are correct', () => {
    cy.get('[data-test=wordGroupInput]').type('1000');
    page.getAnagramListItems().each( e => {
      cy.wrap(e).find('.anagram-list-wordGroup').contains('10000 Common Words', {matchCase: false});
    });
  });

  // sorting not implemented yet
  // it('should click sort alphabetical and increasing and check that elements returned are correct', () => {
  //   cy.get('[data-test=sortTypeSelect]').get('mat-option').contains('Alphabetical').click();
  //   cy.get('[data-test=sortOrderSelect]').get('mat-radio-button').contains('Increasing').click();
  //   let lastLetter: "A";
  //   page.getAnagramListItems().each( e => {
  //     const tempLetter = cy.wrap(e).find('.anagram-list-word').toString().charAt(0);
  //     // tempLetter.should('not.be.greaterThan', lastLetter);
  //     // // expect(tempLetter).to.not.be.above(lastLetter).
  //     // cy.wrap(e).find('.anagram-list-word').toString().charAt(0).should('not.be.greaterThan',lastLetter);
  //     expect(lastLetter).to.not.be.at.most(tempLetter);
  //     lastLetter = tempLetter;
  //   });
  // });

  // it('should click sort alphabetical and decreasing and check that elements returned are correct', () => {
  // });

  it('should click add word group and go to right url', () => {
    page.addWordButton().click();
    cy.url().should(url => expect(url.endsWith('/anagram/new')).to.be.true);
    cy.get('.add-word-title').should('have.text', 'New Word Group');
  });

  it('should delete single word and return matSnackBar', () => {
    cy.get('[data-test=deleteWordButton]').first().click();
    page.getSnackBar().contains('word', { matchCase: false });
  });

  // it('should delete word Group and return matSnackBar', () => {
  //   cy.get('[data-test=wordGroupInput]').type("Food");
  //   cy.get('[data-test=deleteWordGroupButton]').click();
  //   page.getSnackBar().contains('word group', { matchCase: false });
  // });
});
