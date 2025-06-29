import { Component, OnInit } from '@angular/core';
import { ConsejosService, Consejo } from 'src/services/consejos.service';
import { WeatherService, WeatherData } from 'src/services/weather.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  selectedSegment = 'overview';
  consejos: Consejo[] = [];
  weatherData: WeatherData | undefined;
  ultimaUbicacion = false; 

  constructor(
    private consejosService: ConsejosService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.cargarConsejos();
    this.cargarClimaConUbicacion(); // principal
  }

  cargarConsejos() {
    this.consejosService.getConsejos().subscribe({
      next: (data) => this.consejos = data,
      error: (err) => console.error('Error al cargar consejos:', err)
    });
  }

  async cargarClimaConUbicacion() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      this.weatherService.getWeatherByCoords(lat, lon).subscribe({
        next: (data) => {
          this.weatherData = data;
          this.ultimaUbicacion = false; 
          localStorage.setItem('weatherData', JSON.stringify(data));
        },
        error: (err) => {
          console.error('Error al obtener clima:', err);
          this.cargarClimaGuardado(); // fallback
        }
      });
    } catch (err) {
      console.error('Error con geolocalización:', err);
      this.cargarClimaGuardado();
    }
  }

  cargarClimaGuardado() {
    const savedData = localStorage.getItem('weatherData');
    if (savedData) {
      this.weatherData = JSON.parse(savedData);
      this.ultimaUbicacion = true; 
      console.log('Mostrando clima desde almacenamiento local.');
    } else {
      this.weatherData = undefined;
      this.ultimaUbicacion = false;
    }
  }
}
