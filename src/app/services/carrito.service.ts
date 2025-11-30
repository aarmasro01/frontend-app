import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito = new BehaviorSubject<any[]>(this.obtenerCarritoLocal());
  carrito$ = this.carrito.asObservable();

  constructor() {}

  private obtenerCarritoLocal(): any[] {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  }

  private guardarCarritoLocal(carrito: any[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  agregarProducto(producto: any) {
    const actual = this.carrito.value;
    const existe = actual.some(p => p.idProducto === producto.idProducto);

    if (!existe) {
      const nuevo = [...actual, producto];
      this.carrito.next(nuevo);
      this.guardarCarritoLocal(nuevo);
    }
  }

  eliminarProducto(index: number) {
    const nuevo = this.carrito.value.filter((_, i) => i !== index);
    this.carrito.next(nuevo);
    this.guardarCarritoLocal(nuevo);
  }

  actualizarCantidad(index: number, cantidad: number) {
    const nuevo = this.carrito.value.map((item, i) =>
      i === index ? { ...item, cantidad } : item
    );
    this.carrito.next(nuevo);
    this.guardarCarritoLocal(nuevo);
  }

  limpiarCarrito() {
    this.carrito.next([]);
    this.guardarCarritoLocal([]);
  }
}
