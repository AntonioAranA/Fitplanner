describe('Navegación a Rutinas', () => {
  beforeEach(() => {
    // Simula que ya estamos logueados
    localStorage.setItem('ingresado', 'true');
    cy.visit('/tabs/home');
  });

  it('Muestra las rutinas recomendadas al cambiar de segmento', () => {
    // Click en botón del segmento Rutinas
    cy.get('ion-segment-button[value="workouts"]').click({ force: true });

    // Espera que el contenido cambie
    cy.get('ion-card-title')
      .contains('Rutinas Recomendadas')
      .should('be.visible');

    // Verifica que estén los nombres de las rutinas
    cy.contains('Full Body').should('exist');
    cy.contains('Cardio Intensivo').should('exist');
    cy.contains('Fuerza y Tonificación').should('exist');

    // Verifica que haya al menos 3 rutinas listadas
    cy.get('ion-list ion-item').should('have.length.at.least', 3);
  });
});
