describe('Grid Component', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    cy.visit('/grid');
  });

  it('should render the grid with default size', () => {
    cy.get('app-grid-component').within(() => {
      cy.get('mat-grid-tile').should('have.length', 100);
    });
  });

  it('should save the grid', () => {
    cy.get('[data-test=saveGridButton]').click();
    cy.get('app-grid-component').within(() => {
      cy.get('button').contains('Save Grid').should('exist');
    });
  });

  it('should cycle typing direction', () => {
    cy.get('button').contains('Cycle Typing Direction').click();
    cy.get('p').contains('Current Typing Direction is').should('exist');
  });
});
