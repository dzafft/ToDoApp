describe('My First Test', () => {
  it('clicks the link "type"', () => {
    cy.visit('https://a3bc9056.todoapp-2qf.pages.dev/#/')

    cy.get('textarea[placeholder="Title..."]').type("1");
    cy.get('textarea[placeholder="Type away..."]').type('2');


  })
})