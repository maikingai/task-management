describe('Task Management App - End to End Testing', () => {

  it('TC01: User logs in successfully with valid email and password', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/tasks');
  });

  it('TC02: User can successfully create a new task', () => {
    
    cy.contains('button', 'Create New Task').click(); 
    cy.url().should('include', '/tasks/new');
    cy.get('input[name="title"]').type('Test create Task with Cypress'); 
    cy.get('textarea[name="description"]').type('Description: System must work correctly according to E2E');

    cy.contains('button', 'Save').click(); 
    cy.url().should('include', '/tasks');
    cy.contains('Test create Task with Cypress').should('be.visible');
  });

  it('TC03: User can successfully edit an existing task', () => {
    cy.contains('Test create Task with Cypress')
      .parent()
      .parent()
      .contains('button', 'Edit') 
      .click();
    cy.url().should('include', '/tasks/edit/');
    cy.get('input[name="title"]')
      .clear()
      .type('Test create Task with Cypress (Edited)');
    cy.contains('button', 'Save').click(); 
    cy.url().should('include', '/tasks');
    cy.contains('Test create Task with Cypress (Edited)').should('be.visible');
  });

  it('TC04: User can successfully delete a task', () => {
    cy.on('window:confirm', () => true);
    cy.contains('Test create Task with Cypress (Edited)')
      .parent()
      .parent()
      .contains('button', 'Delete') 
      .click();
    cy.contains('Test create Task with Cypress (Edited)').should('not.exist');
  });

  it('TC05: User can successfully log out', () => {
    cy.visit('/tasks');
    cy.contains('button', 'Logout').click(); 
    cy.url().should('include', '/login');
  });
    
});