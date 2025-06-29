import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteService } from 'src/services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private sqliteService: SQLiteService
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
  }
}
