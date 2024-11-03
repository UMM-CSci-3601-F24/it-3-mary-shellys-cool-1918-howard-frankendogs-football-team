import { GridPage } from "cypress/support/grid.po";

describe('Grid Component', () => {
    const page = new GridPage();

    beforeEach(() => {
      page.navigateTo();
      // cy.visit('/grid');
    //   cy.visit('localhost:4200/grid');
    });

    before(() => {
      cy.task('seed:database');
    })

    it('should render the grid with default size', () => {
      cy.get('app-grid-component').within(() => {
        cy.get('mat-grid-tile').should('have.length', 100);
      });
    });

    it('should save a grid to server', () => {
      cy.get('[data-test=saveGridButton]').click()
        // cy.intercept('api/grid').as('saveGrid');
      page.saveGrid();
        // cy.wait('@saveGrid');
        // cy.url({timeout: 300000}).should('match', /\/grid$/); ------------ This is a current
      //ideally would also have some sort of visual indication it was saved
      // like implementing the visual of previously saved grids

      //there should be something in the test here that looks at the actual server and checks that a new grid is there
    })

  it('should render the grid with custom size', () => {
    cy.get('#mat-input-0').type('{backspace}{backspace}11')
    cy.get('app-grid-component').within(() => {
      cy.get('mat-grid-tile').should('have.length', 110);
    });
  });

  it('should black-out the cell with all edges bolded', () => {
    cy.get('#mat-input-3').type('{ctrl}{rightarrow}{downarrow}{uparrow}{leftarrow}');
    cy.get('#mat-input-3').should('have.css', 'background-color').and('eq', 'rgb(0, 0, 0)');
  });
});



