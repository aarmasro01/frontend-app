import { Component, computed, signal, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';

import { CommonModule } from '@angular/common';

import { IonicModule, ToastController } from '@ionic/angular';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import * as L from 'leaflet'; // Importación de Leaflet



// --- INTERFACES ---

interface Pedido {

  idPedido: number;

  idEstadoPedido: number;

  nombreReceptor: string;

  apellidosReceptor: string;

  correoReceptor: string;

  telefonoReceptor: string;

  fecha: string;

  hora: string;

  direccionEntrega: string;

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



interface Repartidor {

  idRepartidor: number;

  nombreCompleto: string;

}



interface Zona {

  idZona: number;

  distrito: string;

  costoEnvio: string | number;

}



@Component({

  selector: 'app-detalle-pedido',

  standalone: true,

  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule],

  templateUrl: './detalle-pedido.page.html',

  styleUrls: ['./detalle-pedido.page.scss'],

})

export class DetallePedidoPage implements OnInit, OnDestroy {

  private baseUrl = 'https://backend-app-fa5c.onrender.com/api';

  idPedido = signal<number | null>(null);

  pedido = signal<Pedido | null>(null);

  detalles = signal<DetallePedido[]>([]);

  productosPorId = signal<Record<number, Producto>>({});

  repartidores = signal<Repartidor[]>([]);

  existeAsignacion = signal(false);

  cargando = signal(false);

  error = signal<string | null>(null);

  rolUsuario: number | null = null;



  public idRepartidorSeleccionado: number | '' = '';

  delivery = 5;

  private readonly defaultDelivery = 5;

  private zonas: Zona[] = [];



  // --- PROPIEDADES DE MAPA (Solo Cliente) ---

  private map: L.Map | null = null;

  private markerCliente: L.Marker | null = null;

  private readonly DEFAULT_COORDS: L.LatLngTuple = [-12.04639, -77.04278]; // Coordenadas de Lima, Perú (ejemplo)

  // ----------------------------------------



  subtotal = computed(() =>

    this.detalles().reduce((acc, d) => acc + parseFloat(String(d.subtotal)), 0)

  );



  total = computed(() => this.subtotal() + this.delivery);

  cancelado = signal(false);



  constructor(private http: HttpClient, private toast: ToastController, private cdr: ChangeDetectorRef) {

   

  }



  ionViewWillEnter(): void {

    this.init(); // <--- ¡Asegura la carga de datos con el nuevo ID!

  }



  ngOnInit(): void {

    const rol = localStorage.getItem('rolUsuario');

    this.rolUsuario = rol ? parseInt(rol, 10) : null;

  }



  // Hook de Angular para limpiar recursos al salir de la página

  ngOnDestroy(): void {

    // Solo necesitamos eliminar el mapa, ya no hay EventSource que detener.

    if (this.map) {

      this.map.remove();

      this.map = null;

    }

  }



  // ----------------------------------------------------------------------

  // 🗺️ MAPA (Solo ubicación del Cliente)

  // ----------------------------------------------------------------------



  private inicializarMapa(): void {

    if (this.map) {

      return;

    }

   

    // El setTimeout es crucial para asegurar que el div del mapa existe en el DOM después del *ngIf

    setTimeout(() => {

        const mapContainer = document.getElementById('mapa-tracking');

        if (!mapContainer) {

             console.error('El contenedor del mapa (mapa-tracking) no se encontró.');

             return;

        }



        this.map = L.map('mapa-tracking').setView(this.DEFAULT_COORDS, 13);



        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

        }).addTo(this.map);



        // Icono para el Destino (Cliente)

        const IconoDestino = L.icon({

            iconUrl: 'assets/ubicacion.png',

            iconSize: [38, 38],

            iconAnchor: [19, 38],

        });



        // Marcador de Cliente (Destino)

        this.markerCliente = L.marker(this.DEFAULT_COORDS, { icon: IconoDestino }).addTo(this.map);

        this.markerCliente.setOpacity(0.5);

    }, 100);

  }

 

  private async geocodificarDireccion(direccion: string): Promise<{ lat: number; lng: number } | null> {

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

    try {

        // Se elimina la propiedad 'headers' que contenía el User-Agent prohibido.

        const res = await this.http.get<any[]>(url).toPromise();

       

        if (!res || res.length === 0) {

            console.log("No se encontró la dirección para geocodificar.");

            return null;

        }

        return {

            lat: parseFloat(res[0].lat),

            lng: parseFloat(res[0].lon)

        };

    } catch (error) {

        console.error("Error en geocodificación", error);

        return null;

    }

  }



  private async actualizarMapaCliente(direccion: string): Promise<void> {

      this.inicializarMapa();

      const coords = await this.geocodificarDireccion(direccion);

     

      // Esperar a que el mapa se inicialice

      await new Promise(resolve => setTimeout(resolve, 150));

     

      if (coords && this.map && this.markerCliente) {

          const latlng: L.LatLngTuple = [coords.lat, coords.lng];

          this.markerCliente.setLatLng(latlng);

          this.markerCliente.setOpacity(1);

          this.map.setView(latlng, 15);

      }

  }



  // ----------------------------------------------------------------------

  // ⚙️ INICIALIZACIÓN Y CARGA DE DATOS

  // ----------------------------------------------------------------------



  private async init(): Promise<void> {

    const fromLS = localStorage.getItem('verPedido');

    if (fromLS) {

      try {

        this.idPedido.set(JSON.parse(fromLS));

      } catch {

        this.idPedido.set(Number(fromLS));

      }

    }



    if (!this.idPedido()) {

      this.error.set('No se encontró el id del pedido.');

      return;

    }



    this.cargando.set(true);

    try {

      await Promise.all([

        this.cargarPedido(this.idPedido()!),

        this.cargarDetalles(this.idPedido()!),

        this.cargarRepartidores(),

        this.cargarZonas(),

      ]);



      this.calcularDelivery();

      this.cancelado.set(this.pedido()?.idEstadoPedido === 6);

     

      // PASO CLAVE 1: Inicializar mapa y marcador de cliente

      if (this.pedido()?.direccionEntrega) {

          await this.actualizarMapaCliente(this.pedido()!.direccionEntrega);

      }



      // PASO CLAVE 2: Verificar solo si existe asignación (sin iniciar SSE)

      await this.verificarAsignacionExistente();



    } catch (e) {

      console.error(e);

      this.error.set('Error cargando datos del pedido');

    } finally {

      this.cargando.set(false);
      this.cdr.detectChanges();

    }

  }



  private async cargarPedido(id: number): Promise<void> {

    const data = await this.http.get(`${this.baseUrl}/pedidos/${id}`).toPromise();

    if (data) {

      this.pedido.set(data as Pedido);

      this.cancelado.set((data as Pedido).idEstadoPedido === 6);

    }

  }



  private async cargarDetalles(id: number): Promise<void> {

    const data: any = await this.http

      .get(`${this.baseUrl}/detalles/pedido/${id}`)

      .toPromise();

    const dets: DetallePedido[] = data?.detalles ?? [];

    this.detalles.set(dets);

    await this.precargarProductos(dets);

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



  private async cargarRepartidores(): Promise<void> {

    const data = await this.http.get<Repartidor[]>(`${this.baseUrl}/repartidores/`).toPromise();

    this.repartidores.set(data ?? []);

  }



  private async cargarZonas(): Promise<void> {

    try {

      const data: any = await this.http.get(`${this.baseUrl}/zonas/`).toPromise();

      this.zonas = Array.isArray(data) ? data : data?.zonas ?? [];

    } catch (e) {

      console.warn('No se pudieron cargar zonas de reparto', e);

      this.zonas = [];

    }

  }



  private calcularDelivery(): void {

    const direccion: string = (this.pedido()?.direccionEntrega || '')

      .toString()

      .toLowerCase()

      .trim();

    if (!direccion) {

      this.delivery = this.defaultDelivery;

      return;

    }

    let costo = this.defaultDelivery;

    for (const z of this.zonas) {

      const distrito = (z?.distrito || '').toString().toLowerCase().trim();

      if (distrito && direccion.includes(distrito)) {

        const val = parseFloat(String(z.costoEnvio));

        if (!isNaN(val)) {

          costo = val;

          break;

        }

      }

    }

    this.delivery = costo;

  }



  // ----------------------------------------------------------------------

  // 📦 ASIGNACIÓN Y ESTADO

  // ----------------------------------------------------------------------



  private async obtenerAsignacionPedido(id: number): Promise<any[]> {

    const data = await this.http.get<any[]>(`${this.baseUrl}/asignaciones/pedido/${id}`).toPromise();

    return data ?? [];

  }



  private fechaHoraAsignacion() {

    const fecha = new Date();

    // Formato YYYY-MM-DD

    const fechaAsignacion = fecha.toISOString().slice(0, 10);

    // Formato HH:MM:SS

    const horaAsignacion = fecha.toTimeString().slice(0, 8);

    return { fechaAsignacion, horaAsignacion };

  }



  // Modificado: Solo verifica si existe la asignación para pre-seleccionar el repartidor.

  private async verificarAsignacionExistente(): Promise<void> {
    if (!this.idPedido()) return;
    
    const asignacion = await this.obtenerAsignacionPedido(this.idPedido()!);
    const asignacionActiva = asignacion?.[0]; 

    if (asignacionActiva) {
      this.existeAsignacion.set(true);
      const idRep = asignacionActiva.idRepartidor;
      if (idRep) this.idRepartidorSeleccionado = idRep;
    } else {
      this.existeAsignacion.set(false);
      this.idRepartidorSeleccionado = ''; // <-- FIX: Asegura que el valor sea string vacío si no hay asignación
    }
    
    // 🛑 FIX: Forzar la detección de cambios para que el [value] en el ion-select se actualice
    this.cdr.detectChanges(); 
  }



  // Modificado: Ya no llama a iniciarTrackingSSE.

  async onChangeRepartidor(): Promise<void> {

    if (!this.idPedido()) return;

    const idRepartidor = Number(this.idRepartidorSeleccionado);

    if (!idRepartidor) return;



    const asignacion = await this.obtenerAsignacionPedido(this.idPedido()!);

    const asignacionActiva = asignacion?.[0];



    if (!asignacionActiva) {

      // Crear nueva asignación

      const { fechaAsignacion, horaAsignacion } = this.fechaHoraAsignacion();

      const asig = {

        idPedido: this.idPedido(),

        idRepartidor,

        fechaAsignacion,

        horaAsignacion,

        estadoAsignacion: 'Asignado',

      };

      try {

        await this.http.post(`${this.baseUrl}/asignaciones/`, asig).toPromise();

        this.existeAsignacion.set(true);

        await this.showToast('Asignación creada');

        await this.verificarAsignacionExistente();



      } catch (e) {

        console.error(e);

        await this.showToast('Error al crear asignación', 'danger');

      }

    } else {

      // Actualizar asignación existente

      try {

        const idAsignacion = asignacionActiva.idAsignacion;

        await this.http.put(`${this.baseUrl}/asignaciones/${idAsignacion}/repartidor`, { idRepartidor }).toPromise();

        await this.showToast('Repartidor actualizado');

      } catch (error) {

        console.error(error);

        await this.showToast('Error al actualizar repartidor', 'danger');

      }

    }

  }



  async clickPaso(estadoIdx: number): Promise<void> {

    if (this.esCancelado()) return;

    const mapping = [1, 2, 3, 4, 5];

    const idEstadoPedido = mapping[estadoIdx];

    if (!idEstadoPedido || !this.idPedido()) return;

    await this.actualizarEstado(this.idPedido()!, idEstadoPedido);

    await this.cargarPedido(this.idPedido()!);

  }



  async actualizarEstado(idPedido: number, idEstadoPedido: number): Promise<void> {

    try {

      const res: any = await this.http

        .put(`${this.baseUrl}/pedidos/${idPedido}/estado`, { idEstadoPedido })

        .toPromise();

      await this.showToast(res?.message || 'Estado actualizado');

    } catch (error: any) {

      console.error(error);

      await this.showToast(

        error?.error?.message || 'Error al actualizar estado',

        'danger'

      );

    }

  }



  async onToggleCancelado(ev: any): Promise<void> {

    if (!this.idPedido()) return;

    const checked = !!(ev?.detail?.checked ?? ev?.target?.checked);

    if (checked) {

      await this.actualizarEstado(this.idPedido()!, 6);

    } else {

      await this.cargarPedido(this.idPedido()!);

      await this.showToast(

        'El estado cancelado no se puede revertir desde aquí',

        'warning'

      );

    }

    await this.cargarPedido(this.idPedido()!);

    this.cancelado.set(this.pedido()?.idEstadoPedido === 6);

  }



  // ----------------------------------------------------------------------

  // 🎨 UTILIDADES Y HELPERS DE VISTA

  // ----------------------------------------------------------------------

 

  fechaLimpia(fechaIso?: string): string {

    if (!fechaIso) return '';

    return (fechaIso || '').split('T')[0] || fechaIso;

  }



  productoDe(det: DetallePedido): Producto | null {

    return this.productosPorId()[det.idProducto] ?? null;

  }



  imagenUrl(producto: Producto | null): string {

    if (!producto || !producto.imagenProducto) return '';

    return `${producto.imagenProducto}`;

  }



  precioNum(valor: number | string): number {

    return parseFloat(String(valor));

  }



  clasePasoActivo(idx: number): boolean {

    const p = this.pedido();

    if (!p) return false;

    if (p.idEstadoPedido === 6) return false;

    const mapa = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 } as const;

    const activo = mapa[p.idEstadoPedido as 1 | 2 | 3 | 4 | 5];

    return (activo ?? -1) >= idx;

  }



  esCancelado(): boolean {

    return this.pedido()?.idEstadoPedido === 6;

  }



  private async showToast(message: string, color: string = 'success') {

    const toast = await this.toast.create({

      message: message,

      duration: 3000,

      position: 'bottom',

      color: color,

    });

    await toast.present();

  }

}