import { Component, OnInit, computed, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// --- INTERFACES PORTADAS DEL DETALLE-PEDIDO.PAGE.TS ---
interface Pedido {
  idPedido: number;
  idEstadoPedido: number;
  // Solo se incluyen las propiedades necesarias para la UI actual (opcional)
  // nombreReceptor: string; 
  // ...
}

interface DetallePedido {
  idDetallePedido: number;
  idProducto: number;
  cantidad: number;
  subtotal: string | number;
}

interface Producto {
  idProducto: number;
  nombre: string;
  precio: number | string;
  imagenProducto: string;
}

// --- FIN INTERFACES ---

type EstadoPedido = 1 | 2 | 3 | 4 | 5 | 6;

@Component({
  selector: 'app-seguimiento-pedido',
  standalone: true,
  // Aseguramos la importación de HttpClientModule para las llamadas HTTP
  imports: [IonicModule, CommonModule, RouterLink, HttpClientModule], 
  templateUrl: './seguimiento-pedido.page.html',
  styleUrls: ['./seguimiento-pedido.page.scss'],
})
export class SeguimientoPedidoPage implements OnInit {

  private baseUrl = 'https://backend-app-fa5c.onrender.com/api';
  
  pedido: Pedido | null = null;
  idEstado: EstadoPedido | 0 = 0;
  
  // --- PROPIEDADES PORTADAS PARA EL RESUMEN ---
  detalles = signal<DetallePedido[]>([]);
  productosPorId = signal<Record<number, Producto>>({});
  delivery: number = 5; // Valor fijo, simplificado sin lógica de zonas

  // Cálculos reactivos (computed signals)
  subtotal = computed(() =>
    this.detalles().reduce((acc, d) => acc + parseFloat(String(d.subtotal || 0)), 0)
  );
  total = computed(() => this.subtotal() + this.delivery);
  // --- FIN PROPIEDADES PORTADAS ---

  // Para activar visualmente las bolitas
  estadosActivos = {
    recibido: false,
    confirmado: false,
    listo: false,
    encamino: false,
    entregado: false,
  };

  // Inyectamos HttpClient para poder hacer las peticiones
  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    try {
      const raw = localStorage.getItem('miPedido');
      if (raw) {
        this.pedido = JSON.parse(raw);
        this.idEstado = (this.pedido?.idEstadoPedido ?? 0) as EstadoPedido | 0;
        
        // Cargar los detalles del pedido para el resumen
        if (this.pedido?.idPedido) {
            await this.cargarDetalles(this.pedido.idPedido);
        }

        this.pintarEstados();
      }
    } catch (e) {
      console.error('Error cargando pedido desde localStorage:', e);
      this.pedido = null;
      this.idEstado = 0;
    }
  }

  pintarEstados() {
    const id = this.idEstado;

    this.estadosActivos.recibido = id >= 1;
    this.estadosActivos.confirmado = id >= 2;
    this.estadosActivos.listo = id >= 3;
    this.estadosActivos.encamino = id >= 4;
    this.estadosActivos.entregado = id >= 5;
  }

  // ----------------------------------------------------------------------
  // 💾 LÓGICA DE CARGA DE DETALLES Y PRODUCTOS (PORTADA)
  // ----------------------------------------------------------------------
  
  private async cargarDetalles(id: number): Promise<void> {
    try {
        const data: any = await this.http
            .get(`${this.baseUrl}/detalles/pedido/${id}`)
            .toPromise(); // Usando toPromise para simular el comportamiento anterior
        
        const dets: DetallePedido[] = data?.detalles ?? [];
        this.detalles.set(dets);
        await this.precargarProductos(dets);
    } catch (e) {
        console.error('Error al cargar detalles del pedido:', e);
    }
  }

  private async precargarProductos(dets: DetallePedido[]): Promise<void> {
    const ids = Array.from(new Set(dets.map((d) => d.idProducto)));
    const cache: Record<number, Producto> = { ...this.productosPorId() };
    
    const requests = ids
      .filter((id) => !cache[id])
      .map(async (id) => {
        const p = await this.http.get<Producto>(`${this.baseUrl}/products/${id}`).toPromise();
        if (p) cache[id] = p;
      });
      
    await Promise.all(requests);
    this.productosPorId.set(cache);
  }
  
  // ----------------------------------------------------------------------
  // 🎨 HELPERS PARA EL TEMPLATE (PORTADOS)
  // ----------------------------------------------------------------------

  productoDe(det: DetallePedido): Producto | null {
    return this.productosPorId()[det.idProducto] ?? null;
  }

  imagenUrl(producto: Producto | null): string {
    if (!producto || !producto.imagenProducto) return '';
    // Ajustado para ruta de assets de Ionic
    return `assets/${producto.imagenProducto}`; 
  }
}