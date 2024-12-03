import { AddWordPage } from 'cypress/support/add-word.po';

describe('add word list', () => {
  const page = new AddWordPage();

  beforeEach(() => {
    page.navigateTo();
    cy.wait(30000);
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


})
