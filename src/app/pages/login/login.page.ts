import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null; // Para mostrar errores

  constructor(private fb: FormBuilder, private router: Router) {}

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

  onLogin() {
  if (this.loginForm.valid) {
    const storedUserStr = localStorage.getItem('user');

    if (!storedUserStr) {
      this.loginError = 'No hay usuarios registrados. Por favor regístrate primero.';
      return;
    }

    const storedUser = JSON.parse(storedUserStr);

    if (
      storedUser.email === this.email.value &&
      storedUser.password === this.password.value
    ) {
      // Login exitoso - actualizar isLoggedIn
      storedUser.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(storedUser));

      this.loginError = null;
      console.log('Login exitoso', this.loginForm.value);
      this.router.navigate(['/tabs/home']);
    } else {
      // Credenciales incorrectas
      this.loginError = 'Email o contraseña incorrectos.';
    }
  } else {
    this.loginForm.markAllAsTouched();
  }
}
}
