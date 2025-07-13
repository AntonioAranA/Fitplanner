import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private platform: Platform) {}

  async login(email: string, password: string): Promise<boolean> {
    if (!this.platform.is('capacitor')) {
      // MOCK: solo en navegador
      if (email === 'usuario@correo.com' && password === '123456') {
        localStorage.setItem('usuario', JSON.stringify({ email }));
        localStorage.setItem('ingresado', 'true'); 
      } else {
        return false;
      }
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('ingresado');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('ingresado') === 'true';
  }
}
