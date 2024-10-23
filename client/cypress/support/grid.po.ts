export class GridPage {
  private readonly url = '/grid';

  navigateTo(){
    return cy.visit(this.url);
  }

  saveGrid() {
    return cy.get("[data-test=saveGrid]").click();
  }
}
