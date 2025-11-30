import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Pago {
  idPago: number;
  metodoPago: string;
  fechaPago: string; // ISO
  comprobantePago: string;
  montoPago: number // file name
}

@Injectable({ providedIn: 'root' })
export class PagosService {
  private http = inject(HttpClient);
  private baseUrl = 'https://backend-app-fa5c.onrender.com/api/pagos';

  listar(): Observable<Array<Pago>> {
    return this.http.get<Array<Pago>>(`${this.baseUrl}/`);
  }

  // Client-side filters mimicking original logic
  filtrar(pagos: Array<Pago>, idTerm: string, metodo: string, fecha: string): Array<Pago> {
    const idBuscar = idTerm.trim();
    const metodoBuscar = metodo.trim().toLowerCase();
    const fechaBuscar = fecha.trim();

    return pagos.filter(p => {
      // filter by id
      const okId = !idBuscar ? true : Number(idBuscar) === p.idPago;
      // filter by metodo
      const okMetodo = !metodoBuscar ? true : (p.metodoPago ?? '').toLowerCase() === metodoBuscar;
      // filter by fecha (only YYYY-MM-DD part)
      const onlyDate = (p.fechaPago ?? '').split('T')[0];
      const okFecha = !fechaBuscar ? true : onlyDate === fechaBuscar;

      return okId && okMetodo && okFecha;
    });
  }
}