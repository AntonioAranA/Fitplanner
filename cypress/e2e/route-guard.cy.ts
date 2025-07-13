describe('Ruta protegida', () => {
  it('Redirige al login si no hay sesión', () => {
    cy.visit('/tabs/profile');
    cy.url().should('include', '/login');
  });
});