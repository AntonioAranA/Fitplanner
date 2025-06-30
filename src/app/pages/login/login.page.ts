import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SQLiteService } from 'src/services/sqlite.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sqliteService: SQLiteService,
    private toastController: ToastController,
    private loadingController: LoadingController
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

  async presentToast(message: string, color: string = 'danger', icon: string = 'alert-circle') {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 2500,
      position: 'bottom',
      color,
      cssClass: 'custom-toast',
      buttons: [{ text: 'OK', role: 'cancel' }],
      htmlAttributes: { innerHTML: true }, 
    });
    await toast.present();
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Verificando credenciales...',
        spinner: 'crescent',
      });

      await loading.present();

      const email = this.email.value;
      const password = this.password.value;

      try {
        const usuario = await this.sqliteService.validarUsuario(email, password);
        await loading.dismiss();

        if (usuario) {
          const userSession = {
            name: usuario.nombre,
            email: usuario.email,
            isLoggedIn: true
          };

          localStorage.setItem('user', JSON.stringify(userSession));
          localStorage.setItem('ingresado', 'true');
          this.router.navigate(['/tabs/home']);
        } else {
          const emailExiste = await this.sqliteService.existeEmail?.(email);
          if (emailExiste) {
            this.presentToast('Contraseña incorrecta.', 'warning', 'lock-closed');
          } else {
            this.presentToast('Correo no registrado.', 'danger', 'mail');
          }
        }

      } catch (error) {
        await loading.dismiss();
        console.error('Error durante el login:', error);
        this.presentToast('Error al intentar iniciar sesión.', 'danger', 'warning');
      }
    } else {
      this.loginForm.markAllAsTouched();
      this.presentToast('Por favor completa todos los campos.', 'medium', 'alert-circle');
    }
  }
}
