describe('Navegación a Consejos', () => {
  beforeEach(() => {
    // Simular sesión activa
    localStorage.setItem('ingresado', 'true');
    cy.visit('/tabs/home');
  });

  it('Muestra consejos al cambiar de segmento', () => {
    // Click en el segmento "Consejos"
    cy.get('ion-segment-button[value="tips"]').click({ force: true });

    // Verifica el título principal
    cy.get('ion-card-title')
      .contains('Consejos para Entrenar')
      .should('be.visible');

    // Verifica que aparezcan algunos consejos 
    cy.get('ion-list ion-item').should('have.length.at.least', 1);

    // Verifica que haya íconos de bombilla
    cy.get('ion-icon[name="bulb-outline"]').should('exist');

    // Verifica que cada consejo tenga un título y descripción
    cy.get('ion-item').first().within(() => {
      cy.get('ion-label h3').should('exist');
      cy.get('ion-label p').should('exist');
    });
  });
});
