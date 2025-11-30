import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AlertController,
  ToastController,
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonRadio,
  IonRadioGroup,
  IonToast,
  IonCheckbox
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';

interface Zona {
  idZona: number;
  distrito: string;
  costoEnvio: string | number;
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonRadio,
    IonRadioGroup,
    IonButton,
    IonButtons,
    IonToast,
    IonCheckbox
  ],
})
export class PagoPage implements OnInit {

  carrito: any[] = [];
  cliente: any = null;
  metodoDePago: string = '';
  autorizacion = false;
  comprobanteFile: File | null = null;

  delivery = 0;
  resumenAbierto = false;

  toastOpen = false;
  toastMsg = '';

  // zonas de reparto
  private zonas: Zona[] = [];
  private readonly defaultDelivery = 5;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private router: Router,
    private carritoService: CarritoService,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {

    // Suscribirse al carrito si tu servicio emite cambios
    if ((this.carritoService as any).carrito$) {
      (this.carritoService as any).carrito$.subscribe((c: any[]) => {
        this.carrito = c || [];
      });
    }

    // Cargar localStorage por si el servicio no tiene
    const guardado = localStorage.getItem('carrito');
    this.carrito = guardado ? JSON.parse(guardado) : this.carrito || [];

    const clienteGuardado = localStorage.getItem('clientePedido');
    this.cliente = clienteGuardado ? JSON.parse(clienteGuardado) : null;

    // cargar zonas y calcular delivery
    await this.cargarZonas();
    this.calcularDelivery();
  }

  // Cargar zonas desde backend
  private async cargarZonas(): Promise<void> {
    try {
      const data: any = await this.http
        .get('https://backend-app-fa5c.onrender.com/api/zonas/')
        .toPromise();

      this.zonas = Array.isArray(data) ? data : (data?.zonas ?? []);
    } catch (e) {
      console.warn('No se pudieron cargar zonas de reparto', e);
      this.zonas = [];
    }
  }

  // Calcular delivery según cliente.direccion
  calcularDelivery(): void {
    const direccion: string =
      (this.cliente?.direccion || '').toString().toLowerCase().trim();

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

  toggleResumen() {
    this.resumenAbierto = !this.resumenAbierto;
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.comprobanteFile = input.files[0];
      this.showToast('Captura añadida');
    }
  }

  getSubTotal(): number {
    return this.carrito.reduce(
      (acc, p) => acc + (p.precio * (p.cantidad || 1)),
      0
    );
  }

  getTotal(): number {
    return +(this.getSubTotal() + this.delivery).toFixed(2);
  }

  async finalizarCompra() {

    // validaciones
    if (!this.autorizacion) {
      await this.showAlert('Autorización requerida', 'Necesitamos tu autorización para continuar.');
      return;
    }

    if (!this.metodoDePago) {
      await this.showAlert('Seleccione método', 'Por favor, seleccione un método de pago.');
      return;
    }

    if (this.metodoDePago !== 'Efectivo' && !this.comprobanteFile) {
      const ok = await this.confirm(
        'No hay comprobante',
        'No seleccionaste un comprobante. ¿Deseas continuar sin comprobante?'
      );
      if (!ok) return;
    }

    const confirm = await this.confirm(
      'Confirmar compra',
      `Total a pagar: S/${this.getTotal()}. ¿Deseas confirmar la compra?`
    );
    if (!confirm) return;

    try {
      // --- registrar pago ---
      const pago = await this.crearPago();
      const registroPago = await this.registrarPago(pago);

      // --- crear pedido ---
      const pedido = await this.crearPedido(registroPago?.idPago);
      await this.registrarPedido(pedido);

      // --- guardar detalles ---
      await this.guardarDetalles();

      await this.showAlert('Compra realizada', 'Tu pedido se procesó correctamente.');

      this.limpiarCarritoYVolver();

    } catch (err) {
      console.error('Error finalizarCompra', err);
      await this.showAlert('Error', 'Ocurrió un error al procesar. Revisa la consola.');
    }
  }

  // Crear objeto pago
  private async crearPago() {
    const fecha = new Date();
    const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');

    const form = new FormData();
    form.append('metodoPago', this.metodoDePago);
    if (this.comprobanteFile)
      form.append('comprobantePago', this.comprobanteFile, this.comprobanteFile.name);
    form.append('fechaPago', fechaFormateada);
    const total = this.getTotal(); 
    form.append('montoPago', String(total));

    return form;
  }

  private async registrarPago(formData: FormData) {
    try {
      const res: any = await this.http
        .post('https://backend-app-fa5c.onrender.com/api/pagos/register', formData)
        .toPromise();
      return res;
    } catch (e) {
      console.error('registrarPago error', e);
      throw e;
    }
  }

  private async obtenerIdPago(): Promise<number | null> {
    try {
      const res: any = await this.http
        .get('https://backend-app-fa5c.onrender.com/api/pagos/ultimo')
        .toPromise();
      return res?.idPago ?? null;
    } catch (e) {
      console.error('obtenerIdPago', e);
      return null;
    }
  }

  private async crearPedido(idPagoParam?: number | null) {
    const fechaPedido = new Date();

    const pedido: any = {
      idUsuario: this.cliente?.idUsuario ?? null,
      idCliente: this.cliente?.idCliente ?? null,
      nombreReceptor: this.cliente?.nombres ?? '',
      apellidosReceptor: this.cliente?.apellidos ?? '',
      correoReceptor: this.cliente?.correo ?? '',
      telefonoReceptor: this.cliente?.telefono ?? '',
      direccionEntrega: this.cliente?.direccion ?? '',
      fecha: fechaPedido.toISOString().split('T')[0],
      hora: fechaPedido.toLocaleTimeString(),
      idEstadoPedido: 1,
      tipoComprobantePago: this.cliente?.comprobante ?? '',
      idPago: idPagoParam ?? await this.obtenerIdPago(),
    };

    return pedido;
  }

  private async registrarPedido(pedido: any) {
    try {
      const res: any = await this.http
        .post('https://backend-app-fa5c.onrender.com/api/pedidos/register', pedido)
        .toPromise();
      return res;
    } catch (e) {
      console.error('registrarPedido', e);
      throw e;
    }
  }

  private async obtenerIdPedido(): Promise<number | null> {
    try {
      const res: any = await this.http
        .get('https://backend-app-fa5c.onrender.com/api/pedidos/ultimo')
        .toPromise();
      return res?.idPedido ?? null;
    } catch (e) {
      console.error('obtenerIdPedido', e);
      return null;
    }
  }

  private async crearDetallePedido(producto: any) {
    const idPedido = await this.obtenerIdPedido();

    return {
      idPedido,
      idProducto: producto.idProducto,
      precioUnitario: producto.precio,
      cantidad: producto.cantidad || 1,
      subtotal: producto.precio * (producto.cantidad || 1)
    };
  }

  private async registrarDetalle(detalle: any) {
    try {
      const res: any = await this.http
        .post('https://backend-app-fa5c.onrender.com/api/detalles/register', detalle)
        .toPromise();
      return res;
    } catch (e) {
      console.error('registrarDetalle', e);
      throw e;
    }
  }

  private async guardarDetalles() {
    for (const producto of this.carrito) {
      const detalle = await this.crearDetallePedido(producto);
      await this.registrarDetalle(detalle);
    }
  }

  // Helpers UI
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async confirm(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Continuar', role: 'confirm' }
      ]
    });

    await alert.present();
    const r = await alert.onDidDismiss();
    return r.role === 'confirm';
  }

  private async showToast(msg: string) {
    this.toastMsg = msg;
    this.toastOpen = true;
    setTimeout(() => (this.toastOpen = false), 1500);
  }

  volver() {
    this.router.navigate(['/checkout']);
  }

  private limpiarCarritoYVolver() {
    try {
      this.carritoService.limpiarCarrito();
    } catch (e) {
      console.warn('No se pudo vaciar el carrito', e);
    }

    localStorage.setItem('carrito', JSON.stringify([]));
    this.router.navigate(['/tabs/menu']);
  }

}
