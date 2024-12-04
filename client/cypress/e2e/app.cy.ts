import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'EEEEE-Tool');
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

  it('should create a new room and navigate to it', () => {

    // Create a new room
    cy.get('[data-test="room-name-input"]').type('Test Room');
    cy.get('[data-test="create-room-button"]').click();

    // Verify the room was created and navigate to it
    cy.get('[data-test="go-to-room-grids-button"]').click();
    cy.url().should('include', '/grids');
  });

  it('should navigate to the playground grid', () => {
    // Click on button
    cy.get('[data-test="playground-grid-button"]').click();

    // Verify that we navigate to the blank playground grid
    cy.url().should('include', '/grid');
  });

  it('should navigate to the anagram page', () => {
    cy.get('[data-test="anagram-button"]').click();
    cy.url().should('include', '/anagram');
  })
});
