import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteService } from 'src/services/sqlite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private sqliteService: SQLiteService,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    try {
      await this.sqliteService.initDB();
      console.log('SQLite inicializado desde app.component');
    } catch (error) {
      console.error('Error al inicializar SQLite:', error);
    }

    this.verificarSesion();
  }

  verificarSesion() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.isLoggedIn) {
        console.log('Usuario activo, redirigiendo a /tabs/home');
        this.router.navigateByUrl('/tabs/home');
      }
    }
  }
}
