
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