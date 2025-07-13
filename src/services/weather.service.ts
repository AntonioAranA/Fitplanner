import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Platform } from '@ionic/angular';

export interface WeatherData {
  weather: { description: string; icon: string; }[];
  main: { temp: number; humidity: number; };
  wind: { speed: number; };
  name: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = 'c95a28184dae946ec5df34669e580c1b';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  private isWeb: boolean;

  constructor(private http: HttpClient, private platform: Platform) {
    this.isWeb = !this.platform.is('capacitor');
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    if (this.isWeb) {
      // 🧪 MOCK en entorno navegador
      return of({
        weather: [{ description: 'Despejado', icon: '01d' }],
        main: { temp: 25, humidity: 40 },
        wind: { speed: 5 },
        name: 'MockCity'
      });
    }

    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get<WeatherData>(url);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    if (this.isWeb) {
      return of({
        weather: [{ description: 'Parcialmente nublado', icon: '03d' }],
        main: { temp: 22, humidity: 50 },
        wind: { speed: 3 },
        name: 'Ubicación mock'
      });
    }

    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get<WeatherData>(url);
  }
}
