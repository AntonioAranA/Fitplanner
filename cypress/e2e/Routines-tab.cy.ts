describe('Ruta /tabs/routine - Rutinas personalizadas', () => {
  beforeEach(() => {
    // Simular sesión activa
    localStorage.setItem('ingresado', 'true');
    cy.visit('/tabs/routine');
  });

  it('Carga rutinas disponibles y permite ver ejercicios', () => {
    // Verifica el título o header si existe
    cy.get('ion-title', { timeout: 10000 }).contains(/fitplanner/i).should('exist');

    // Espera a que se carguen las rutinas conocidas
    cy.contains('Principiante', { timeout: 10000 }).should('exist');
    cy.contains('Cardio').should('exist');
    cy.contains('Fuerza').should('exist');

    // Interactúa con la rutina "Principiante"
    cy.contains('Principiante').click({ force: true });

    // Espera a que se carguen los ejercicios dentro de la rutina expandida
    cy.get('ion-item', { timeout: 10000 }).should('have.length.at.least', 1);

    // Verifica que se muestren algunos ejercicios conocidos
    cy.contains('Sentadillas').should('exist');
    cy.contains('Flexiones').should('exist');
  });
});
