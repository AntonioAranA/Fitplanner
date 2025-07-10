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
  const start = performance.now(); // ⏱️ Inicio

  await this.sqliteService.initDB();
  this.rutinas = await this.sqliteService.getRutinasConEjercicios();

  const end = performance.now(); // ⏱️ Fin
  const duracion = (end - start).toFixed(2);
  console.log(`⏳ Tiempo de carga de rutinas: ${duracion} ms`);


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
