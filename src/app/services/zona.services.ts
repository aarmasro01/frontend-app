import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Zona {
  idZona: number;
  distrito: string;
  costoEnvio: number;
}

export interface CrearZonaDto {
  distrito: string;
  costoEnvio: number;
}

export interface ActualizarZonaDto {
  distrito: string;
  costoEnvio: number;
}

@Injectable({ providedIn: 'root' })
export class ZonasService {
  private http = inject(HttpClient);
  private baseUrl = 'https://backend-app-fa5c.onrender.com/api/zonas';

  listar(): Observable<Array<Zona>> {
    return this.http.get<Array<Zona>>(`${this.baseUrl}/`);
  }

  crear(dto: CrearZonaDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, dto);
  }

  actualizar(idZona: number, dto: ActualizarZonaDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idZona}`, dto);
  }

  eliminar(idZona: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idZona}`);
  }

  filtrarPorDistrito(termino: string): Observable<Array<Zona>> {
    const q = termino.trim().toLowerCase();
    if (!q) {
      return this.listar();
    }
    return this.listar().pipe(
      map(zonas => zonas.filter(z => z.distrito?.toLowerCase().includes(q)))
    );
  }
}