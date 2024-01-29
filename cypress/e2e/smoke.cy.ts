describe("smoke tests", () => {
  it("should show welcome page with next button", () => {
    cy.visitAndCheck("/");
    cy.findByText("Welcome!"); // Welcome header
    cy.findByText("Next"); // Next button
  });

  it("should navigate through slides and reach the game", () => {
    cy.visitAndCheck("/");

    // slide one
    cy.findByTestId("next").should("not.be.disabled");
    cy.findByTestId("next").click();

    // slide two
    cy.findByTestId("next").should("be.disabled");
    cy.findByTestId("next").should("not.be.disabled");
    cy.findByTestId("next").click();

    // slide three
    cy.findByTestId("next").should("be.disabled");
    cy.findByTestId("next").should("not.be.disabled");
    cy.findByTestId("next").click();

    // navigated to game
    cy.location("pathname").should("contain", "/game");
  });

  it("should show game page elements", () => {
    cy.visitAndCheck("/game/0");

    cy.findByTestId("card");
    cy.findByTestId("oh-no");
    cy.findByTestId("ay-yo");
  });
});
