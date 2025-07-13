describe('Login - Incorrecto', () => {
  it('Muestra error con credenciales inválidas', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('malo@correo.com');
    cy.get('input[type="password"]').type('claveIncorrecta');

    cy.contains('Ingresar').click();

    cy.get('ion-toast').should('exist');
    cy.get('ion-toast').contains('Correo no registrado.');
  });
});
