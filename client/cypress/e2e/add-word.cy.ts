import { AddWordPage } from 'cypress/support/add-word.po';

describe('add word list', () => {
  const page = new AddWordPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Word Group');
  });

  it('should enable and disable add word button', () => {
    page.addWordButton().should('be.disabled');
    page.getFormField('wordGroup').type('test-wordGroup');
    page.addWordButton().should('be.disabled');
    page.getFormField('word').type('test-word1');
    page.addWordButton().should('be.enabled');
    page.getFormField('wordGroup').clear();
    page.addWordButton().should('be.disabled');
    page.getFormField('wordGroup').type('test-wordGroup1');
    page.addWordButton().should('be.enabled');
  });

  it('should return proper error messages', () => {
    cy.get('[data-test=wordGroupError]').should('not.exist');
    page.getFormField('wordGroup').click().blur();
    cy.get('[data-test=wordGroupError]').should('exist').and('be.visible');
    // page.getFormField('wordGroup').type('');
    // cy.get('[data-test=wordGroupError]').should('exist').and('be.visible');
    page.getFormField('wordGroup').type('Art');
    cy.get('[data-test=wordGroupError]').should('not.exist');

    cy.get('[data-test=wordError]').should('not.exist');
    page.getFormField('word').click().blur();
    cy.get('[data-test=wordError]').should('exist').and('be.visible');
    // page.getFormField('word').type('');
    // cy.get('[data-test=wordError]').should('exist').and('be.visible');
    page.getFormField('word').type('Mosaic');
    cy.get('[data-test=wordError]').should('not.exist');
  });

  // describe('Adding a new word list', () => {
  //   beforeEach(() => {
  //     cy.task('seed:database');
  //   });

  //   it('should go to right page and have correct field inputs', () => {
  //     const wordList: Word = {
  //       wordGroup: 'Groceries',
  //       word: ' eggs          milkshake          yogurt',
  //     };

  //     cy.intercept('/api/anagram').as('addWord');
  //     page.addWord(wordList);
  //     cy.wait('@addWord');

  //     cy.url({timeout: 300000})
  //       .should('match', /\/anagram$/)
  //       .should('not.match', /\/anagram\/new$/);

  //     page.getSnackBar().should('contain', `Added Word List ${wordList.wordGroup}`);
  //   })

  //   it('should fail with incorrect field inputs', () => {
  //     const wordList: Word = {
  //       wordGroup: null,
  //       word: ' eggs\nmilkshake\nyogurt',
  //     };

  //     page.addWord(wordList);
  //     page.getSnackBar().should('contain', 'Tried to add an illegal new word list');

  //     cy.url({timeout: 300000})
  //       .should('not.match', /\/anagram$/)
  //       .should('match', /\/anagram\/new$/);

  //     page.getFormField('word').should('have.value', wordList.word);
  //   })
  // })
})
