import { Component } from '@angular/core';
import { SQLiteService } from '../../../services/sqlite.service';

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
    this.rutinas = await this.sqliteService.getRutinasConEjercicios(); 
  }
}
