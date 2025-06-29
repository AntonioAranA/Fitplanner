import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consejo {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsejosService {
  private consejosUrl = 'assets/data/consejos.json'; 

  constructor(private http: HttpClient) {}

  getConsejos(): Observable<Consejo[]> {
    return this.http.get<Consejo[]>(this.consejosUrl);
  }
}
