describe('Login - Correcto', () => {
  it('Inicia sesión con datos válidos y muestra resumen', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('usuario@correo.com');
    cy.get('input[type="password"]').type('123456');

    cy.contains('Ingresar').click({ force: true });

    cy.url({ timeout: 10000 }).should('include', 'tabs/home');

    cy.get('ion-title').contains('FitPlanner').should('exist');

    cy.get('ion-card-title').contains('Resumen de Hoy').should('be.visible');

    cy.contains('Has completado').should('exist');
  });
});
