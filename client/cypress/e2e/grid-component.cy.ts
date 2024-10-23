import { GridPage } from "cypress/support/grid.po";

describe('Grid Component', () => {
    const page = new GridPage();

    beforeEach(() => {
      page.navigateTo();
      // cy.visit('/grid');
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
      cy.intercept('api/grid').as('saveGrid');
      page.saveGrid();
      cy.wait('@saveGrid');
      cy.url({timeout: 300000}).should('match', /\/grid$/);
      //ideally would also have some sort of visual indication it was saved
      // like implementing the visual of previously saved grids

      //there should be something in the test here that looks at the actual server and checks that a new grid is there
    })
  });
