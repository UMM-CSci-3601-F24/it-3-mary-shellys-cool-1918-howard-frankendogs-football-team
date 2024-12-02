import { GridPage } from 'cypress/support/grid.po';

describe('Grid Component', () => {
  const page = new GridPage();

  beforeEach(() => {
    page.navigateTo();
    cy.task('seed:database');
  });

  it('should save a grid to server', () => {
    page.saveGrid();
    cy.wait(3000);
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(3) > button').click();
    cy.get(':nth-child(3) > :nth-child(2) > :nth-child(3) > button').click();

  });

  it('should render the grid with default size', () => {
    cy.get('app-grid-component').within(() => {
      cy.get('mat-grid-tile').should('have.length', 100);
    });
  });

  it('should render the grid with custom size', () => {
    cy.get('#mat-input-0').type('{backspace}{backspace}11');
    cy.get('app-grid-component').within(() => {
      cy.get('mat-grid-tile').should('have.length', 110);
    });
  });

  it('should black-out the cell with all edges bolded', () => {
    cy.get('#mat-input-3').click({ ctrlKey: true });
    cy.get('#mat-input-3')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(0, 0, 0)');
  });

  it('should un-black cell background, but keep edges', () => {
    cy.get('#mat-input-3').click({ ctrlKey: true });
    cy.get('#mat-input-3').click({ altKey: true });
    cy.get('#mat-input-3')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 255)');
  });

  it('should highlight cell', () => {
    cy.get('#mat-input-3').rightclick();
    cy.get('#mat-input-3')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 192, 203)');
  });

  it('should un-highlight cell', () => {
    cy.get('#mat-input-3').rightclick();
    cy.get('#mat-input-3').rightclick();
    cy.get('#mat-input-3')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 255)');
  });

  it('should highlight cell on mouseleave', () => {
    cy.get('#mat-input-3').trigger('mouseleave', {shiftKey: true});
    cy.get('#mat-input-3')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 192, 203)');
  });
});


it('should expand and collapse panel', () => {
  cy.visit('/grid');

  cy.get('mat-expansion-panel-header').should('not.have.class', 'mat-expanded');

  cy.get('mat-expansion-panel-header').click();

  cy.get('mat-expansion-panel-header').should('have.class', 'mat-expanded');

  cy.get('mat-expansion-panel-header').click();

  cy.get('mat-expansion-panel-header').should('not.have.class', 'mat-expanded');
})
