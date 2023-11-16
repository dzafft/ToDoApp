// Set the base URL globally
Cypress.config("baseUrl", "http://localhost:3000");

beforeEach(() => {
  cy.visit("/");
});

describe("Note Adding and Verification", () => {
  it("should add a note and verify its content", () => {
    cy.get("#titleTextarea").clear().type("1").should("have.value", "1");

    cy.get("#textTextarea").clear().type("2").should("have.value", "2");

    cy.get(".submit-button").click();

    // Use relative path with cy.visit
    cy.visit("/#/notelist");

    cy.get(".note").then(($cards) => {
      const lastCard = $cards[$cards.length - 1];

      cy.wrap(lastCard).find(".note-title").should("have.text", "1");

      cy.wrap(lastCard).find(".text-content").should("have.text", "2");
    });
  });
});

describe("Update note and verification", () => {
  it("should add a note, then edit, and verify its content", () => {
    cy.get("#titleTextarea").clear().type("3").should("have.value", "3");

    cy.get("#textTextarea").clear().type("2").should("have.value", "2");

    cy.get(".submit-button").click();

    // Use relative path with cy.visit
    cy.visit("/#/notelist");

    cy.get(".note").then(($cards) => {
      const lastCard = $cards[$cards.length - 1];

      cy.wrap(lastCard).find(".update-button").click();
    });

    cy.url().should("eq", Cypress.config("baseUrl") + "/#/");

    cy.get("#titleTextarea").should("have.value", "3").clear().type("300");

    cy.get("#textTextarea").should("have.value", "2").clear().type("200");

    cy.get(".submit-button").click();
    cy.contains("Yes").click();

    // Use relative path with cy.visit
    cy.visit("/#/notelist"); //this cy visit doesnt work

    cy.get(".note").then(($cards) => {
      const lastCard = $cards[$cards.length - 1];

      cy.wrap(lastCard).find(".note-title").should("have.text", "300");

      cy.wrap(lastCard).find(".text-content").should("have.text", "200");
    });
  });
});

describe("Delete note and verification", () => {
  it("should add a note, then delete, and verify", () => {
    cy.get("#titleTextarea").clear().type("3").should("have.value", "3");

    cy.get("#textTextarea").clear().type("2").should("have.value", "2");

    cy.get(".submit-button").click();

    // Use relative path with cy.visit
    cy.visit("/#/notelist");

    cy.get(".note").then(($cards) => {
      const lastCard = $cards[$cards.length - 1];

      cy.wrap(lastCard).find(".delete-button").click();
      cy.contains("Yes").click();
    });

    cy.get(".note").should("have.length", 0);
  });
});
