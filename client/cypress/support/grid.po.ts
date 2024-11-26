export class GridPage {
  private readonly url = '/seededGrid/grid';

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
