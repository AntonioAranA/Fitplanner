import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: { name: string; email: string; isLoggedIn?: boolean } = { name: '', email: '' };

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isLoggedIn) {
        this.user = user;
      } else {
        // Si no está logueado, redirige a login
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    } else {
      // No hay usuario guardado, redirige a login
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  logout() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      user.isLoggedIn = false; // Solo cambiar el estado de sesión
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}