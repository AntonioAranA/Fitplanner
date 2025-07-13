describe('Registro de usuario', () => {
  it('Registra un usuario nuevo y luego inicia sesión', () => {
    cy.visit('/register');

    // Datos de prueba
    const nombre = 'Usuario Test';
    const email = 'usuario@correo.com';
    const password = '123456';

    // Completa el formulario
    cy.get('ion-input[formControlName="name"] input').filter(':visible').type(nombre);
    cy.get('ion-input[formControlName="email"] input').filter(':visible').type(email);
    cy.get('ion-input[formControlName="password"] input').filter(':visible').type(password);
    cy.get('ion-input[formControlName="confirmPassword"] input').filter(':visible').type(password);

    // Enviar formulario
    cy.contains('Registrarse').click();

    // Verifica que redirige al login
    cy.url({ timeout: 10000 }).should('include', '/login');

    // Realiza login con las mismas credenciales
    cy.get('ion-input[formControlName="email"] input').filter(':visible').type(email);
    cy.get('ion-input[formControlName="password"] input').filter(':visible').type(password);
    cy.contains('Ingresar').click();

    // Verifica que redirige al home
    cy.url({ timeout: 10000 }).should('include', '/tabs/home');

    // Verifica que hay sesión activa
    cy.window().should((win) => {
      expect(win.localStorage.getItem('ingresado')).to.eq('true');
    });

    // Verifica que hay botón para cerrar sesión
    cy.visit('/tabs/home');
    cy.contains('Has completado').should('exist');
  });
});
