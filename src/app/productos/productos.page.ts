import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Ionic standalone components (seguir patrón de la org)
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ProductosService, Producto } from '../services/productos.service';
import { TabsOverlayBusService } from '../services/tabs-overlay-bus.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProductosPage implements OnInit, OnDestroy {
  productos: Producto[] = [];
  cargando = false;
  rolUsuario: number | null = null;

  // Filtros/Buscador
  filtroTexto = '';
  filtroEstado: '' | '1' | '2' = '';
  filtroCategoria: '' | '1' | '2' | '3' = '';

  private apiBaseUrl = 'https://backend-app-fa5c.onrender.com/api/products';

  private subs = new Subscription();

  constructor(
    private productosService: ProductosService,
    private overlayBus: TabsOverlayBusService
  ) {}

  ngOnInit() {
    const rol = localStorage.getItem('rolUsuario');
    this.rolUsuario = rol ? parseInt(rol, 10) : null;
    this.cargarProductos();
    this.subs.add(
      this.overlayBus.refetchProductos$.subscribe(() => this.cargarProductos())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async cargarProductos() {
    try {
      this.cargando = true;
      this.productos = await this.productosService.obtenerProductos();
    } finally {
      this.cargando = false;
    }
  }

  get productosFiltrados(): Producto[] {
    const texto = this.filtroTexto.trim().toLowerCase();
    return this.productos.filter(p => {
      const coincideTexto = !texto || p.nombre.toLowerCase().includes(texto);
      const coincideEstado = !this.filtroEstado || p.idEstadoProducto === parseInt(this.filtroEstado, 10);
      const coincideCategoria = !this.filtroCategoria || p.idCategoriaMenu === parseInt(this.filtroCategoria, 10);
      return coincideTexto && coincideEstado && coincideCategoria;
    });
  }

  // Pedir al Tabs que abra los overlays
  abrirRegistrar() {
    this.overlayBus.openRegistrarProducto$.next();
  }

  abrirActualizar(producto: Producto) {
    this.overlayBus.openActualizarProducto$.next(producto);
  }

  categoriaProducto(p: Producto): string {
    if (p.idCategoriaMenu === 1) return 'Entrada';
    if (p.idCategoriaMenu === 2) return 'Segundo';
    if (p.idCategoriaMenu === 3) return 'Bebida';
    return '-';
  }

  async manejarCambioEstado(producto: Producto, event: any) {
    const nuevoEstado = event.target.checked ? 1 : 2;

    try {
      await this.actualizarEstadoProducto(producto.idProducto, nuevoEstado);
      
      producto.idEstadoProducto = nuevoEstado;

      alert(`Estado de ${producto.nombre} actualizado a: ${nuevoEstado === 1 ? 'Disponible' : 'No disponible'}`);
      
    } catch (error) {

      event.target.checked = !event.target.checked;
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del producto.'); 
    }
  }

  async actualizarEstadoProducto(idProducto: number, idEstadoProducto: number): Promise<any> {
    console.log(`Actualizando producto ${idProducto} a estado ${idEstadoProducto}`);
    
    const res = await fetch(`${this.apiBaseUrl}/${idProducto}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "idEstadoProducto": idEstadoProducto })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Fallo en la actualización de la API');
    }
    return data;
  }

  async eliminarProducto(id: number, nombre: string) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${nombre}"? Esta acción es irreversible.`)) {
      return;
    }

    try {
      // 1. Llamar al servicio
      await this.productosService.eliminarProducto(id);

      // 2. Notificación de éxito
      alert(`Producto "${nombre}" eliminado exitosamente.`);

      // 3. Recargar la lista para actualizar la vista
      this.cargarProductos(); 

      // Opcional: Si solo quieres actualizar el array sin recargar:
      // this.productos = this.productos.filter(p => p.idProducto !== id);

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al intentar eliminar el producto. Consulta la consola para más detalles.');
    }
  }
}