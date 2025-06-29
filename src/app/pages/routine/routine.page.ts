import { Component, OnInit } from '@angular/core';
import { SQLiteService } from '../../../services/sqlite.service';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: false,
})
export class RoutinePage implements OnInit {
  rutinas: any[] = [];
  
  openedIndexes: Set<number> = new Set();

  constructor(private sqliteService: SQLiteService) {}

  async ngOnInit() {
  await this.sqliteService.initDB(); 
  this.rutinas = await this.sqliteService.getRutinasConEjercicios(); 

}



}
