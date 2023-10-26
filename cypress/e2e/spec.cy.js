// describe('Note Adding and Verification', () => {
//   it('should add a note and verify its content', () => {
//     cy.visit('https://12428b39.todoapp-2qf.pages.dev/#/')

//     // Ensure the page is fully loaded before interacting with elements
//     cy.wait(1000); // Adjust the waiting time as needed

//     // Clear the input field and type "1"
//     cy.get('textarea[placeholder="Title..."]')
//       .clear()
//       .type("1")
//       .should("have.value", "1");

//     // Wait for the textarea with the "Type Away..." placeholder to appear
//     cy.get('textarea[placeholder="Type away..."]').should("exist");

//     // Clear the input field and type "2"
//     cy.get('textarea[placeholder="Type away..."]')
//       .clear()
//       .type("2")
//       .should("have.value", "2");

//     cy.get('.submit-button').click();

//     cy.visit('https://12428b39.todoapp-2qf.pages.dev/#/notelist');

//     cy.get('.note').then(($cards) => {
//       // Get the last card in the list
//       const lastCard = $cards[$cards.length - 1];

//       // Check the title and text of the last card
//       cy.wrap(lastCard)
//         .find('.note-title')
//         .should('have.text', '1'); // Replace '1' with the expected title

//       cy.wrap(lastCard)
//         .find('.text-content')
//         .should('have.text', '2'); // Replace '2' with the expected text
//     });
//   });
// });


describe('Update Check', () => {
  it('should add a note, then edit, and verify its content', () => {
    cy.visit('https://12428b39.todoapp-2qf.pages.dev/#/')
    // Clear the input field and type "1"
    cy.get('textarea[placeholder="Title..."]')
      .clear()
      .type("3")
      .should("have.value", "3");

    // Clear the input field and type "2"
    cy.get('textarea[placeholder="Type away..."]')
      .clear()
      .type("2")
      .should("have.value", "2");

    cy.get('.submit-button').click();


    cy.visit('https://12428b39.todoapp-2qf.pages.dev/#/notelist');

    cy.get('.note').then(($cards) => {
      // Get the first card in the list
      const firstCard = $cards[0];

      // Find and click the "Edit" button inside the first card
      cy.wrap(firstCard)
        .find('.update-button')
        .click();
    });

    // Verify the URL has changed to the expected URL
    cy.url().should('eq', 'https://12428b39.todoapp-2qf.pages.dev#/');
    //check noteTitle
    // cy.get('textarea[placeholder="Title..."]')
    //   .should("have.value", "3");

    // //check noteText
    // cy.get('textarea[placeholder="Type away..."]')
    //   .should("have.value", "2");
    
 
    



  });
});
