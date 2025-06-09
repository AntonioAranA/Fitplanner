import { Component } from '@angular/core';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: false
})
export class RoutinePage {
  rutina = [
    {
      nombre: 'Sentadillas',
      repeticiones: '3 series de 15 repeticiones',
      imagen: 'assets/ejercicios/sentadillas.jpg'
    },
    {
      nombre: 'Flexiones',
      repeticiones: '3 series de 10 repeticiones',
      imagen: 'assets/ejercicios/flexiones.jpg'
    },
    {
      nombre: 'Abdominales',
      repeticiones: '3 series de 20 repeticiones',
      imagen: 'assets/ejercicios/abdominales.jpg'
    },
    {
      nombre: 'Plancha',
      repeticiones: '3 series de 30 segundos',
      imagen: 'assets/ejercicios/plancha.jpg'
    },
    {
      nombre: 'Zancadas',
      repeticiones: '3 series de 12 por pierna',
      imagen: 'assets/ejercicios/zancadas.webp'
    }
  ];
}
