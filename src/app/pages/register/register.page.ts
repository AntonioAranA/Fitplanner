import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SQLiteService } from 'src/services/sqlite.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  registerError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sqliteService: SQLiteService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  async onSubmit() {
    if (
      this.registerForm.valid &&
      this.password.value === this.confirmPassword.value
    ) {
      const nombre = this.name.value;
      const email = this.email.value;
      const password = this.password.value;

      const registrado = await this.sqliteService.registrarUsuario(nombre, email, password);

      if (registrado) {
        this.registerError = null;
        console.log('Usuario registrado exitosamente en SQLite');
        this.router.navigate(['/login']);
      } else {
        this.registerError = 'El correo ya está registrado. Intenta con otro.';
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
