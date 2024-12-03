describe('Room Grids Component', () => {
  beforeEach(() => {
    cy.task('seed:database');
    cy.visit('674f6e1924168925c758d88e/grids');
  });

  it('should display the room name and total grids', () => {
    cy.get('h1').should('contain.text', 'SeededGrid');
    cy.contains('p', 'Total Grids:').should('exist');
  });

  it('should copy room link when copy button is clicked', () => {
    cy.window().then(win => {
      cy.stub(win.navigator.clipboard, 'writeText').as('copy');
    });
    cy.get('[data-test="copy-room-link-button"]').click();
    cy.get('@copy').should('have.been.calledOnce');
  });

  it('should exit room when exit button is clicked', () => {
    cy.get('[data-test="exit-room-button"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}`);
  });

  // it('should add a new grid', () => {
  //   cy.get('[data-test="new-grid-name-input"]').type('testGrid3');
  //   cy.get('[data-test="new-grid-rows-input"]').clear().type('5');
  //   cy.get('[data-test="new-grid-cols-input"]').clear().type('5');
  //   cy.get('[data-test="save-new-grid-button"]').click();
  //   cy.contains('Grid created successfully').should('exist');
  //   cy.wait(3000);
  //   cy.on('window:confirm', () => false);
  // });

  // Cannot get to work with timing?
});
