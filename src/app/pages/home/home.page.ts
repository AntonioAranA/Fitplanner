import { Component, OnInit } from '@angular/core';
import { ConsejosService, Consejo } from 'src/services/consejos.service';
import { WeatherService, WeatherData } from 'src/services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  selectedSegment = 'overview';
  consejos: Consejo[] = [];
  weatherData: WeatherData | undefined;

  constructor(
    private consejosService: ConsejosService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.cargarConsejos();
    this.cargarClima(); // importante
  }

  cargarConsejos() {
    this.consejosService.getConsejos().subscribe({
      next: (data) => this.consejos = data,
      error: (err) => console.error('Error al cargar consejos:', err)
    });
  }

  cargarClima() {
    this.weatherService.getWeather('San Felipe').subscribe({
      next: (data) => this.weatherData = data,
      error: (err) => console.error('Error al obtener clima:', err)
    });
  }
}
