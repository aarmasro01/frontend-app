import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Pedido {
  idPedido: number;
  idEstadoPedido: number;
  nombreReceptor: string;
  apellidosReceptor: string;
  fecha: string;
  hora: string;
  idPago: number | string;
}

interface Pago {
  idPago: number;
  metodoPago: string;
  comprobantePago: string | null;
  fechaPago: string;
  montoPago: string | number;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage {

  filtroTexto = '';
  filtroEstado = '';
  filtroFecha = '';

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  estados: { idEstadoPedido: number; nombreEstadoPedido: string }[] = [];

  cargando = false;
  error: string | null = null;

  private baseUrl = 'https://backend-app-fa5c.onrender.com/api';

  constructor(private http: HttpClient) {
    this.init();
  }

  private async init(): Promise<void> {
    await Promise.all([
      this.cargarEstados(),
      this.cargarPedidosUsuario()
    ]);
  }

  async cargarPedidosUsuario(): Promise<void> {
    this.cargando = true;
    this.error = null;

    try {
      const usuarioRaw = localStorage.getItem('usuario');
      const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
      const idUsuario = usuario?.idUsuario;

      if (!idUsuario) {
        this.pedidos = [];
        this.pedidosFiltrados = [];
        this.error = 'No se encontró el usuario en sesión';
        return;
      }

      const data = await this.http
        .get<Pedido[]>(`${this.baseUrl}/pedidos/user/${idUsuario}`)
        .toPromise();

      this.pedidos = data ?? [];
      this.aplicarFiltros();

    } catch (e) {
      this.error = 'No se pudo cargar el historial de pedidos';
      console.error(e);
    } finally {
      this.cargando = false;
    }
  }

  async cargarEstados(): Promise<void> {
    try {
      const data = await this.http
        .get<any[]>(`${this.baseUrl}/estadospedidos/`)
        .toPromise();

      this.estados = (data ?? []).map(e => ({
        idEstadoPedido: e.idEstadoPedido,
        nombreEstadoPedido: this.nombreEstadoNormalizado(
          e.idEstadoPedido,
          e.nombreEstadoPedido
        ),
      }));

    } catch (e) {
      console.error('Error cargando estados', e);
    }
  }

  nombreEstadoNormalizado(id: number, fallback: string): string {
    switch (id) {
      case 1: return 'Recibido';
      case 2: return 'Confirmado';
      case 3: return 'Listo';
      case 4: return 'En Camino';
      case 5: return 'Entregado';
      case 6: return 'Cancelado';
      default: return fallback || `Estado ${id}`;
    }
  }

  fechaLimpia(fechaIso: string): string {
    return (fechaIso || '').split('T')[0] || '';
  }

  async obtenerMontoPorPago(idPago: number | string): Promise<number> {
    try {
      if (!idPago) return 0;

      const data: any = await this.http
        .get(`${this.baseUrl}/pagos/${idPago}`)
        .toPromise();

      const pago: Pago = data?.pago ?? data;
      const monto = parseFloat(String(pago?.montoPago ?? 0));

      return isNaN(monto) ? 0 : monto;

    } catch (e) {
      console.error('Error obteniendo monto por pago', e);
      return 0;
    }
  }

  aplicarFiltros(): void {
    const fecha = this.filtroFecha;
    const estado = this.filtroEstado;

    this.pedidosFiltrados = this.pedidos.filter(p => {
      const okEstado =
        estado === '' || p.idEstadoPedido === parseInt(estado, 10);
      const okFecha = !fecha || this.fechaLimpia(p.fecha) === fecha;

      return okEstado && okFecha;
    });
  }


  onFiltroEstado(ev: any): void {
    this.filtroEstado = ev?.detail?.value ?? ev?.target?.value ?? '';
    this.aplicarFiltros();
  }

  onFiltroFecha(ev: any): void {
    this.filtroFecha = ev?.detail?.value ?? ev?.target?.value ?? '';
    this.aplicarFiltros();
  }

  async verPedido(p: Pedido): Promise<void> {
    localStorage.setItem('miPedido', JSON.stringify(p));
    location.href = '/tabs/seguimiento-pedido';
  }

  claseEstado(p: Pedido): string {
    const map: any = {
      1: 'estado estado-recibido',
      2: 'estado estado-confirmado',
      3: 'estado estado-listo',
      4: 'estado estado-en-camino',
      5: 'estado estado-entregado',
      6: 'estado estado-cancelado',
    };
    return map[p.idEstadoPedido] || 'estado';
  }

  private asyncMontoCache: Record<string | number, Promise<number>> = {};

  montoPedido(p: Pedido): Promise<number> {
    const key = p.idPago ?? '';
    if (!this.asyncMontoCache[key]) {
      this.asyncMontoCache[key] = this.obtenerMontoPorPago(key);
    }
    return this.asyncMontoCache[key];
  }
}
