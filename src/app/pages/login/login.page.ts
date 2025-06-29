import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SQLiteService } from 'src/services/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sqliteService: SQLiteService,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const email = this.email.value;
      const password = this.password.value;

      try {
        const usuario = await this.sqliteService.validarUsuario(email, password);

        if (usuario) {
          const userSession = {
            name: usuario.nombre,
            email: usuario.email,
            isLoggedIn: true
          };

          localStorage.setItem('user', JSON.stringify(userSession));
          this.loginError = null;
          this.router.navigate(['/tabs/home']);
        } else {
          // Usuario no encontrado → Verificamos si el email existe
          const emailExiste = await this.sqliteService.existeEmail?.(email);
          if (emailExiste) {
            this.loginError = 'Contraseña incorrecta.';
          } else {
            this.loginError = 'Correo no registrado.';
          }
        }
      } catch (error) {
        console.error('Error durante el login:', error);
        this.loginError = 'Ocurrió un error al intentar iniciar sesión.';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
