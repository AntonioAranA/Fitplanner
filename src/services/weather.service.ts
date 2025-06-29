import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  weather: { description: string; icon: string; }[];
  main: { temp: number; humidity: number; };
  wind: { speed: number; };
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'c95a28184dae946ec5df34669e580c1b';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<WeatherData> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get<WeatherData>(url);
  }
}
