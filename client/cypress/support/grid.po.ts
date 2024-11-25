export class GridPage {
  private readonly url = '/seededGrids/grids';

  navigateTo(){
    return cy.visit(this.url);
  }

  saveGrid() {
    return cy.get('[data-test=saveGridButton]').click();
  }

  getId() {
    return cy.task('this.gridPackage._id');
  }
}
