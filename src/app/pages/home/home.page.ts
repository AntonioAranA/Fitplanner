import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
    private weatherService: WeatherService,
    private toastCtrl: ToastController // ← Agregado
  ) {}

  ngOnInit() {
    this.cargarConsejos();
    this.cargarClimaConUbicacion();
  }

  cargarConsejos() {
    this.consejosService.getConsejos().subscribe({
      next: (data) => this.consejos = data,
      error: async (err) => {
        console.error('Error al cargar consejos:', err);
        const toast = await this.toastCtrl.create({
          message: 'No se pudieron cargar los consejos. Revisa tu conexión.',
          duration: 3000,
          color: 'danger',
        });
        toast.present();
      }
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
        error: async (err) => {
          console.error('Error al obtener clima:', err);
          this.cargarClimaGuardado();

          const toast = await this.toastCtrl.create({
            message: 'No se pudo obtener el clima actual. Mostrando última ubicación guardada.',
            duration: 3000,
            color: 'warning',
          });
          toast.present();
        }
      });
    } catch (err) {
      console.error('Error con geolocalización:', err);
      this.cargarClimaGuardado();

      const toast = await this.toastCtrl.create({
        message: 'No se pudo obtener tu ubicación. Mostrando clima guardado si está disponible.',
        duration: 3000,
        color: 'warning',
      });
      toast.present();
    }
  }

  async cargarClimaGuardado() {
    const savedData = localStorage.getItem('weatherData');
    if (savedData) {
      this.weatherData = JSON.parse(savedData);
      this.ultimaUbicacion = true; 
      console.log('Mostrando clima desde almacenamiento local.');
    } else {
      this.weatherData = undefined;
      this.ultimaUbicacion = false;

      const toast = await this.toastCtrl.create({
        message: 'No hay datos de clima guardados disponibles.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    }
  }
}
