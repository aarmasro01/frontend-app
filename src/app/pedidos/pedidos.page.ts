import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Pedido {
  idPedido: number;
  idEstadoPedido: number;
  nombreReceptor: string;
  apellidosReceptor: string;
  fecha: string;   // ISO
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
  selector: 'app-pedidos',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage {

  // Filtros
  filtroTexto = '';
  filtroEstado = '';
  filtroFecha = '';

  // Datos
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  estados: { idEstadoPedido: number; nombreEstadoPedido: string }[] = [];

  // UI
  cargando = false;
  error: string | null = null;

  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {
    this.init();
  }

  private async init(): Promise<void> {
    await Promise.all([
      this.cargarEstados(),
      this.cargarPedidos()
    ]);
  }

  // -----------------------------
  // CARGAR LISTAS
  // -----------------------------
  async cargarPedidos(): Promise<void> {
    this.cargando = true;
    this.error = null;

    try {
      const data = await this.http
        .get<Pedido[]>(`${this.baseUrl}/pedidos/all`)
        .toPromise();

      this.pedidos = data ?? [];
      this.aplicarFiltros();

    } catch (e: any) {
      this.error = 'No se pudo cargar la lista de pedidos';
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

  // -----------------------------
  // HELPERS
  // -----------------------------
  nombreEstadoNormalizado(id: number, nombreFallback: string): string {
    switch (id) {
      case 1: return 'Recibido';
      case 2: return 'Confirmado';
      case 3: return 'Listo';
      case 4: return 'En Camino';
      case 5: return 'Entregado';
      case 6: return 'Cancelado';
      default: return nombreFallback || `Estado ${id}`;
    }
  }

  fechaLimpia(fechaIso: string): string {
    return (fechaIso || '').split('T')[0] || '';
  }

  // -----------------------------
  // OBTENER MONTO POR ID PAGO
  // -----------------------------
  async obtenerMontoPorPago(idPago: number | string): Promise<number> {
    try {
      if (idPago === null || idPago === undefined || idPago === '') return 0;

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

  // -----------------------------
  // FILTROS
  // -----------------------------
  aplicarFiltros(): void {
    const texto = (this.filtroTexto || '').trim().toLowerCase();
    const fecha = this.filtroFecha;
    const estado = this.filtroEstado;

    this.pedidosFiltrados = this.pedidos.filter(p => {
      const okEstado =
        estado === '' || p.idEstadoPedido === parseInt(estado, 10);

      const nombre = `${p.nombreReceptor} ${p.apellidosReceptor}`.toLowerCase();
      const okTexto =
        texto === '' || nombre.includes(texto);

      const okFecha =
        !fecha || this.fechaLimpia(p.fecha) === fecha;

      return okEstado && okTexto && okFecha;
    });
  }

  // -----------------------------
  // EVENTOS UI
  // -----------------------------
  onBuscar(ev: any): void {
    this.filtroTexto = ev?.target?.value ?? '';
    this.aplicarFiltros();
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
    localStorage.setItem('verPedido', JSON.stringify(p.idPedido));
    location.href = '/tabs/detalle-pedido';
  }

  // -----------------------------
  // ESTILOS POR ESTADO
  // -----------------------------
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

  // -----------------------------
  // CACHE DE MONTOS
  // -----------------------------
  private asyncMontoCache: Record<string | number, Promise<number>> = {};

  montoPedido(p: Pedido): Promise<number> {
    const key = p.idPago ?? '';
    if (!this.asyncMontoCache[key]) {
      this.asyncMontoCache[key] = this.obtenerMontoPorPago(key);
    }
    return this.asyncMontoCache[key];
  }

}
