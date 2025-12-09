import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Producto {
  idProducto: number;
  idCategoriaMenu: number; // 1 Entrada, 2 Segundo, 3 Bebida
  nombre: string;
  precio: number;
  idEstadoProducto: number; // 1 Disponible, 2 No disponible
  imagenProducto: string;   // nombre archivo/URL según backend
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private baseUrl = 'https://backend-app-fa5c.onrender.com/api/products';

  constructor(private http: HttpClient) {}

  async obtenerProductos(): Promise<Producto[]> {
    const data = await this.http.get<Producto[]>(`${this.baseUrl}/`).toPromise();
    return data ?? [];
  }

  async crearProducto(payload: {
    idCategoriaMenu: number;
    nombre: string;
    precio: number;
    idEstadoProducto: number;
    imagenFile?: File | null;
  }): Promise<any> {
    const fd = new FormData();
    fd.append('idCategoriaMenu', String(payload.idCategoriaMenu));
    fd.append('nombre', payload.nombre);
    fd.append('precio', String(payload.precio));
    fd.append('idEstadoProducto', String(payload.idEstadoProducto));
    if (payload.imagenFile) fd.append('imagenProducto', payload.imagenFile);
    return this.http.post(`${this.baseUrl}/create`, fd).toPromise();
  }

  async actualizarProducto(idProducto: number, payload: {
    idCategoriaMenu: number;
    nombre: string;
    precio: number;
    idEstadoProducto: number;
    imagenFile?: File | null;
  }): Promise<any> {
    const fd = new FormData();
    fd.append('idCategoriaMenu', String(payload.idCategoriaMenu));
    fd.append('nombre', payload.nombre);
    fd.append('precio', String(payload.precio));
    fd.append('idEstadoProducto', String(payload.idEstadoProducto));
    if (payload.imagenFile) fd.append('imagenProducto', payload.imagenFile);
    return this.http.put(`${this.baseUrl}/${idProducto}`, fd).toPromise();
  }

  async eliminarProducto(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); 
      throw new Error(errorData.error || 'Fallo en el servidor al eliminar el producto.');
    }
  }

}