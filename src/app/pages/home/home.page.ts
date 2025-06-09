import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  selectedSegment: string = 'overview'; // Valor inicial 'overview' para mostrar el resumen

  constructor() { }

  ngOnInit() {}

}
