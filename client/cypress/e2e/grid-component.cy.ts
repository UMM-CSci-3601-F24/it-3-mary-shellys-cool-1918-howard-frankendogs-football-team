

describe('Grid Component', () => {
    beforeEach(() => {
      cy.visit('/grid');
    });

    it('should render the grid with default size', () => {
      cy.get('app-grid-component').within(() => {
        cy.get('mat-grid-tile').should('have.length', 100);
      });
    });
  });

    before(() => {
      cy.task('seed:database');
    })
  it('should render the grid with custom size', () => {
    cy.get('#mat-input-0').type('{backspace}{backspace}11')
    cy.get('app-grid-component').within(() => {
      cy.get('mat-grid-tile').should('have.length', 110);
    });
  });
});