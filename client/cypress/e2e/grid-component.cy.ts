describe('Grid Component', () => {
    beforeEach(() => {
      cy.visit('localhost:4200/grid');
    });

  it('should render the grid with default size', () => {
    cy.get('app-grid-component').within(() => {
      cy.get('mat-grid-tile').should('have.length', 100);
    });
  });

    it('should render the grid with custom size', () => {

      cy.get('#mat-input-0').type('{backspace}{backspace}11')

      cy.get('app-grid-component').within(() => {
        cy.get('mat-grid-tile').should('have.length', 100);

      });
    });

  it('should black-out the cell with all edges bolded', () => {
    cy.get('app-grid-cell').first().click().type('{ctrl}{rightarrow}{downarrow}{uparrow}{leftarrow}');
  });
});
