import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Reclamo {
  idReclamo: number;
  fechaPedido: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  tipoDocumento: string;
  numDocumento: string;
  direccion: string;
  numPedido: string | number;
  montoReclamo: string | number;
  detalles: string;
  tipoSolicitud: string; // Reclamo | Queja
}

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './reclamos.page.html',
  styleUrls: ['./reclamos.page.scss'],
})
export class ReclamosPage {
  // Filtros
  filtroTexto = '';
  filtroTipo = '';
  filtroFecha = '';

  // Datos
  reclamos: Reclamo[] = [];
  reclamosFiltrados: Reclamo[] = [];

  // UI
  cargando = false;
  error: string | null = null;

  private baseUrl = 'https://backend-app-fa5c.onrender.com/api';

  constructor(private http: HttpClient) {
    this.init();
  }

  private async init(): Promise<void> {
    await this.cargarReclamos();
  }

  async cargarReclamos(): Promise<void> {
    this.cargando = true;
    this.error = null;

    try {
      const data: any = await this.http
        .get(`${this.baseUrl}/reclamos/obtener`)
        .toPromise();

      this.reclamos = data?.reclamos ?? [];
      this.aplicarFiltros();
    } catch (e) {
      console.error(e);
      this.error = 'No se pudo cargar la lista de reclamos';
    } finally {
      this.cargando = false;
    }
  }

  fechaLimpia(fechaIso: string): string {
    return (fechaIso || '').split('T')[0] || '';
  }

  aplicarFiltros(): void {
    const texto = (this.filtroTexto || '').trim().toLowerCase();
    const fecha = this.filtroFecha;
    const tipo = (this.filtroTipo || '').trim().toLowerCase();

    this.reclamosFiltrados = this.reclamos.filter((r) => {
      const okTexto =
        texto === '' ||
        (r.nombreCompleto || '').toLowerCase().includes(texto);

      const okFecha = !fecha || this.fechaLimpia(r.fechaPedido) === fecha;

      const okTipo =
        tipo === '' || (r.tipoSolicitud || '').toLowerCase() === tipo;

      return okTexto && okFecha && okTipo;
    });
  }

  // Eventos UI
  onBuscar(ev: any): void {
    this.filtroTexto = ev?.target?.value ?? '';
    this.aplicarFiltros();
  }

  onFiltroTipo(ev: any): void {
    this.filtroTipo = ev?.detail?.value ?? ev?.target?.value ?? '';
    if (this.filtroTipo === ' ') this.filtroTipo = '';
    this.aplicarFiltros();
  }

  onFiltroFecha(ev: any): void {
    this.filtroFecha = ev?.detail?.value ?? ev?.target?.value ?? '';
    this.aplicarFiltros();
  }

  // Responder por correo
  responder(r: Reclamo): void {
    const to = r.correo;
    const subject = `Respuesta a su reclamo N°${r.idReclamo}`;
    const body = `Estimado ${r.nombreCompleto},

Gracias por contactarnos respecto al pedido PED-${r.numPedido}.

Atentamente,
Servicio al Cliente`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');
  }
}
