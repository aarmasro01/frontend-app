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
}