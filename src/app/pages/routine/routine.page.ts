import { Component } from '@angular/core';
import { SQLiteService } from 'src/services/sqlite.service';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: false,
})
export class RoutinePage {
  rutinas: any[] = [];
  openedIndexes: Set<number> = new Set();

  constructor(private sqliteService: SQLiteService) {}

  async ionViewWillEnter() {
    await this.sqliteService.initDB();
    this.rutinas = await this.sqliteService.getRutinasConEjercicios();
  }

  toggleRutina(index: number) {
    if (this.openedIndexes.has(index)) {
      this.openedIndexes.delete(index);
    } else {
      this.openedIndexes.add(index);
    }
  }

  isOpen(index: number): boolean {
    return this.openedIndexes.has(index);
  }
}
