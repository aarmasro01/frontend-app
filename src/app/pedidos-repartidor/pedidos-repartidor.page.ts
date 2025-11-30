// ...existing code...
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Usuario { idUsuario: number; /* demás campos si aplica */ }
interface Repartidor { idRepartidor: number; idUsuario: number; /* ... */ }
interface Asignacion { idAsignacion: number; idPedido: number; /* ... */ }
interface Pedido { idPedido: number; idEstadoPedido: number; nombreReceptor: string; apellidosReceptor: string; fecha: string; hora: string; idPago: number; /* ... */ }
interface EstadoPedido { idEstadoPedido: number; nombreEstadoPedido: string; }

@Component({
  selector: 'app-pedidos-repartidor',
  templateUrl: './pedidos-repartidor.page.html',
  styleUrls: ['./pedidos-repartidor.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class PedidosRepartidorPage implements OnInit {

  filtroTexto = '';
  filtroEstado = '';
  filtroFecha = '';
  estados: EstadoPedido[] = [];

  cargando = false;
  error: string | null = null;

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];

  private apiBase = 'https://backend-app-fa5c.onrender.com/api';

  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
    await this.cargarEstados();
    await this.mostrarPedidosRepartidor();
  }

  async cargarEstados() {
    try {
      const res = await firstValueFrom(this.http.get<EstadoPedido[]>(`${this.apiBase}/estadospedidos/`));
      this.estados = res || [];
    } catch (e) {
      console.error(e);
      this.error = 'No se pudieron cargar los estados';
    }
  }

  async obtenerRepartidores(): Promise<Repartidor[]> {
    const res = await firstValueFrom(this.http.get<Repartidor[]>(`${this.apiBase}/repartidores/`));
    return res || [];
  }

  async identificarRepartidor(): Promise<Repartidor | null> {
    const usuarioJson = localStorage.getItem('usuario');
    if (!usuarioJson) return null;
    const usuario: Usuario = JSON.parse(usuarioJson);
    const repartidores = await this.obtenerRepartidores();
    return repartidores.find(r => r.idUsuario === usuario.idUsuario) || null;
  }

  async obtenerAsignacionesRepartidor(idRepartidor: number): Promise<Asignacion[]> {
    const res = await firstValueFrom(this.http.get<Asignacion[]>(`${this.apiBase}/asignaciones/repartidor/${idRepartidor}`));
    return res || [];
  }

  async obtenerPedido(idPedido: number): Promise<Pedido> {
    const res = await firstValueFrom(this.http.get<Pedido>(`${this.apiBase}/pedidos/${idPedido}`));
    return res;
  }

  montoPedido(ped: Pedido) {
    // Devuelve un Observable para usar con el async pipe en template
    return this.http.get<{ montoPago: number }>(`${this.apiBase}/pagos/${ped.idPago}`).pipe(
      // map a solo el número (import rxjs/operators si quieres map)
      // Para evitar importar map aquí simplemente transformamos con firstValueFrom en llamada directa no compatible con async pipe.
    );
  }

  // Si prefieres que montoPedido devuelva Promise<number> (no compatible con async pipe si no retornas Promise),
  // la opción siguiente no se usa por template; se deja la anterior para usar async pipe con Observable.
  // async obtenerMontoPago(idPago: number): Promise<number> {
  //   const res = await firstValueFrom(this.http.get<{ montoPago: number }>(`${this.apiBase}/pagos/${idPago}`));
  //   return res?.montoPago ?? 0;
  // }

  claseEstado(ped: Pedido): string {
    switch (ped.idEstadoPedido) {
      case 1: return 'estado-recibido';
      case 2: return 'estado-confirmado';
      case 3: return 'estado-listo';
      case 4: return 'estado-en-camino';
      case 5: return 'estado-entregado';
      case 6: return 'estado-cancelado';
      default: return 'estado-desconocido';
    }
  }

  nombreEstadoNormalizado(id: number, _fallback = ''): string {
    switch (id) {
      case 1: return 'Recibido';
      case 2: return 'Confirmado';
      case 3: return 'Listo';
      case 4: return 'En Camino';
      case 5: return 'Entregado';
      case 6: return 'Cancelado';
      default: return _fallback || 'Desconocido';
    }
  }

  fechaLimpia(fechaIso: string): string {
    return fechaIso ? fechaIso.split('T')[0] : '';
  }

  onBuscar(ev: any) {
    this.filtroTexto = ev.target.value || ev.target.value?.toLowerCase() || '';
    this.aplicarFiltros();
  }

  onFiltroEstado(ev: any) {
    this.filtroEstado = ev.target.value;
    this.aplicarFiltros();
  }

  onFiltroFecha(ev: any) {
    this.filtroFecha = ev.target.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.pedidosFiltrados = this.pedidos.filter(p => this.filtrarEstado(p) && this.filtrarCliente(p) && this.filtrarFecha(p));
  }

  filtrarEstado(pedido: Pedido): boolean {
    if (!this.filtroEstado) return true;
    return pedido.idEstadoPedido === parseInt(this.filtroEstado, 10);
  }

  filtrarCliente(pedido: Pedido): boolean {
    const texto = (this.filtroTexto || '').trim().toLowerCase();
    if (!texto) return true;
    const nombre = `${pedido.nombreReceptor} ${pedido.apellidosReceptor}`.toLowerCase();
    return nombre.includes(texto);
  }

  filtrarFecha(pedido: Pedido): boolean {
    if (!this.filtroFecha) return true;
    const fechaPedido = pedido.fecha.split('T')[0];
    return fechaPedido === this.filtroFecha;
  }

  async mostrarPedidosRepartidor() {
    this.cargando = true;
    this.error = null;
    try {
      const repartidor = await this.identificarRepartidor();
      if (!repartidor) {
        this.error = 'No se encontró repartidor para el usuario actual';
        this.pedidos = [];
        this.pedidosFiltrados = [];
        this.cargando = false;
        return;
      }

      const asignaciones = await this.obtenerAsignacionesRepartidor(repartidor.idRepartidor);
      const pedidosTemp: Pedido[] = [];

      for (const asig of asignaciones) {
        try {
          const p = await this.obtenerPedido(asig.idPedido);
          pedidosTemp.push(p);
        } catch (inner) {
          console.warn('No se pudo obtener pedido', asig.idPedido, inner);
        }
      }

      this.pedidos = pedidosTemp;
      this.aplicarFiltros();
    } catch (e) {
      console.error(e);
      this.error = 'Error cargando pedidos';
    } finally {
      this.cargando = false;
    }
  }

  verPedido(ped: Pedido) {
    localStorage.setItem('verPedido', JSON.stringify(ped.idPedido));
    // navegar a la página de detalle (ajusta la ruta según tu routing)
    this.router.navigate(['/tabs/detalle-pedido']);
  }

}
// ...existing code...