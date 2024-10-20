import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'CSCI 3601 Iteration Template');
  });

  it('The sidenav should open, navigate to "Grid","Home","anagram" and back to "Home"', () => {
    // Before clicking on the button, the sidenav should be hidden
    page.getSidenav()
      .should('be.hidden');
    page.getSidenavButton()
      .should('be.visible');

    // navigate to grid page
    page.getSidenavButton().click();
    page.getNavLink('Grid').click();
    cy.url().should('match', /\/grid$/);
    page.getSidenav()
      .should('be.hidden');

    // Try to navigate to Home
    page.getSidenavButton().click();
    page.getNavLink('Home').click();
    cy.url().should('match', /^https?:\/\/[^/]+\/?$/);
    page.getSidenav()
      .should('be.hidden');

    // Navigate to Anagram Page
    page.getSidenavButton().click();
    page.getNavLink('Anagram Generator').click();
    cy.url().should('match', /\/anagram$/);
    page.getSidenav()
      .should('be.hidden');

    // Navigate home
    page.getSidenavButton().click();
    page.getNavLink('Home').click();
    cy.url().should('match', /^https?:\/\/[^/]+\/?$/);
    page.getSidenav()
      .should('be.hidden');
  });

});
