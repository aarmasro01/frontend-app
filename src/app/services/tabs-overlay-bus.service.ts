// restaurante/src/app/services/tabs-overlay-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Zona } from '../services/zona.services';


export interface ProductoRef {
  idProducto: number;
  idCategoriaMenu: number;
  nombre: string;
  precio: number;
  idEstadoProducto: number;
  imagenProducto: string;
}

@Injectable({ providedIn: 'root' })
export class TabsOverlayBusService {
  // PRODUCTOS
  openRegistrarProducto$ = new Subject<void>();
  openActualizarProducto$ = new Subject<ProductoRef>();
  refetchProductos$ = new Subject<void>();

  // ZONAS
  openRegistrarZona$ = new Subject<void>();
  openActualizarZona$ = new Subject<Zona>();
  refetchZonas$ = new Subject<void>();

  // PAGOS
  openComprobante$ = new Subject<string>(); // src for image
  refetchPagos$ = new Subject<void>();

}
