describe("smoke tests", () => {
  it("should show welcome page", () => {
    cy.visitAndCheck("/");
    cy.findByText("Continue");
  });

  it("should navigate to game", () => {
    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /Continue/i }).click();
    cy.findByText("Ay Yo!");
    cy.findByText("Oh No!");
  });
});
