export class CompanyListPage {
  private readonly baseUrl = '/companies';
  private readonly pageTitle = '.company-list-title';
  private readonly companyCardSelector = '.company-cards-container .company-card';
  // private readonly userListItemsSelector = '.user-nav-list .user-list-item';
  // private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  // private readonly radioButtonSelector = `[data-test=viewTypeRadio] mat-radio-button`;
  // private readonly userRoleDropdownSelector = '[data-test=userRoleSelect]';
  // private readonly dropdownOptionSelector = `mat-option`;
  // private readonly addUserButtonSelector = '[data-test=addUserButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  /**
   * Gets the title of the app when visiting the `/users` page.
   *
   * @returns the value of the element with the ID `.user-list-title`
   */
  getUserTitle() {
    return cy.get(this.pageTitle);
  }

  /**
   * Get all the `company-card` DOM elements.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `company-card` DOM elements.
   */
   getCompanyCards() {
    return cy.get(this.companyCardSelector);
  }

  /**
   * Get a specific `company-card` DOM element by its name
   * (which is in the `_id`) field.
   */
  getCompanyCardByName(companyName: string) {
    return cy
      // Get all the company cards
      .get(this.companyCardSelector)
      // Look for a (sub)element with the company name
      .contains(companyName)
      // Return the containing company card element
      .parents('.company-card');
    }

    /**
     * Get the list of users for a given `company-card` DOM element
     * by its name (which is in the `_id`) field.
     */
    getCompanyCardUserNames(companyName: string) {
      // Get the company card by name, then find the user names
      return this
         // Get the `.company-card` element for the given
         // company name
        .getCompanyCardByName(companyName)
        // Find all the `.company-card-user-name` elements
        // within the company card
        .find('.company-card-user-name');
    }
  }
