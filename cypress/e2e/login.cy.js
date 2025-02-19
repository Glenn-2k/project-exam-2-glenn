describe("Login", () => {
  it("should login with valid credentials", () => {
    cy.visit("/login");
    cy.intercept("POST", "/auth/login").as("loginRequest");
    cy.get('input[name="email"]').type(Cypress.env("cypressEmail"));
    cy.get('input[name="password"]').type(Cypress.env("cypressPassword"));
    cy.get('[data-testid="login-button"]').click();

    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.url().should("include", "/");
  });

  it("should not login with invalid credentials", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("invalid-email@example.com");
    cy.get('input[name="password"]').type("invalid-password");
    cy.get('[data-testid="login-button"]').click();
    cy.url().should("include", "/login");
  });
});
