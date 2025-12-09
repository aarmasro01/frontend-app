import { Component, EnvironmentInjector, inject, OnDestroy, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { BuscarService } from '../services/buscar.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { UiService } from '../services/ui';
import { Subscription } from 'rxjs';
import { RegistrarUsuarioComponent } from '../registrar-usuario/registrar-usuario.component';
import { ActualizarUsuarioComponent } from '../actualizar-usuario/actualizar-usuario.component';
import { TabsOverlayBusService, ProductoRef } from '../services/tabs-overlay-bus.service';
import { RegistrarProductoComponent } from '../registrar-producto/registrar-producto.component';
import { ActualizarProductoComponent } from '../actualizar-producto/actualizar-producto.component';
import { RegistrarZonaComponent } from '../registrar-zona/registrar-zona.component';
import { ActualizarZonaComponent } from '../actualizar-zona/actualizar-zona.component';
import { ComprobanteComponent } from '../comprobante/comprobante.component';
import { Zona } from '../services/zona.services';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    RegistrarUsuarioComponent,
    ActualizarUsuarioComponent,
    RegistrarProductoComponent,
    ActualizarProductoComponent,
    RegistrarZonaComponent,
    ActualizarZonaComponent,
    ComprobanteComponent,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    CommonModule,
    RouterModule
  ],
})
export class TabsPage implements OnInit, OnDestroy {

  public environmentInjector = inject(EnvironmentInjector);

  rutaActual: string = '';
  carritoTieneProductos = false;
  rolUsuario: number | null = null;

  mostrarRegistrarUsuario = false;
  usuarioActualizar: any = null;
  mostrarRegistrarProducto = false;
  productoActualizar: ProductoRef | null = null;
  mostrarRegistrarZona = false;
  zonaActualizar: Zona | null = null;
  mostrarComprobante = false;
  comprobanteSrc: string | null = null;

  private subs = new Subscription();

  constructor(
    private buscarService: BuscarService,
    private router: Router,
    private uiService: UiService,
    private overlayBus: TabsOverlayBusService,
    private authService: AuthService
  ) {
    addIcons({ triangle, ellipse, square });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.rutaActual = event.urlAfterRedirects;
        this.verificarCarrito();
      });

    window.addEventListener('storage', () => this.verificarCarrito());
  }

  ngOnInit(): void {
    this.subs.add(
        this.authService.rolUsuario$.subscribe(rol => {
            this.rolUsuario = rol; // Se actualiza automáticamente al hacer login/logout
        })
    );
    this.verificarCarrito();

    this.uiService.mostrarRegistro$.subscribe(valor => {
      this.mostrarRegistrarUsuario = valor;
    });

    this.uiService.mostrarActualizar$.subscribe(usuario => {
      this.usuarioActualizar = usuario;
    });

    this.subs.add(
      this.overlayBus.openRegistrarProducto$.subscribe(() => {
        this.mostrarRegistrarProducto = true;
      })
    );
    this.subs.add(
      this.overlayBus.openActualizarProducto$.subscribe((producto) => {
        this.productoActualizar = producto;
      })
    );
    this.subs.add(
      this.overlayBus.openRegistrarZona$.subscribe(() => {
        this.mostrarRegistrarZona = true;
      })
    );
    this.subs.add(
      this.overlayBus.openActualizarZona$.subscribe(zona => {
        this.zonaActualizar = zona;
      })
    );
    this.subs.add(
      this.overlayBus.openComprobante$.subscribe(src => {
        this.comprobanteSrc = src;
        this.mostrarComprobante = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  esCliente(): boolean {
    return this.rolUsuario === 1;
  }

  esEncargado(): boolean {
    return this.rolUsuario === 6;
  }

  esEmpleado(): boolean {
    return this.rolUsuario === 7;
  }

  esRepartidor(): boolean {
    return this.rolUsuario === 8;
  }




  esPersonal(): boolean {
    return this.rolUsuario !== 1 && this.rolUsuario !== null;
  }

  onBuscar(event: any) {
    const texto = event.target.value.toLowerCase();
    this.buscarService.actualizarTexto(texto);
  }

  esPaginaBuscar(): boolean { return this.rutaActual.includes('/buscar'); }
  esPaginaHistorial(): boolean { return this.rutaActual.includes('/historial'); }
  esPaginaDetallePedido(): boolean { return this.rutaActual.includes('/detalle-pedido'); }
  esPaginaSeguimientoPedido(): boolean { return this.rutaActual.includes('/seguimiento-pedido'); }
  esPaginaCarrito(): boolean { return this.rutaActual.includes('/tab2'); }

  verificarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.carritoTieneProductos = carrito.length > 0;
  }

  cerrarRegistro() {
    this.uiService.ocultarRegistrarUsuario();
  }

  cerrarActualizar() {
    this.uiService.ocultarActualizarUsuario();
  }

  cerrarRegistrarProducto(refetch = false) {
    this.mostrarRegistrarProducto = false;
    if (refetch) this.overlayBus.refetchProductos$.next();
  }

  cerrarActualizarProducto(refetch = false) {
    this.productoActualizar = null;
    if (refetch) this.overlayBus.refetchProductos$.next();
  }

  abrirRegistrarZona() {
    this.mostrarRegistrarZona = true;
  }

  cerrarRegistrarZona(refetch = false) {
    this.mostrarRegistrarZona = false;
    if (refetch) this.overlayBus.refetchZonas$.next();
  }

  abrirActualizarZona(z: Zona) {
    this.zonaActualizar = z;
  }

  cerrarActualizarZona(refetch = false) {
    this.zonaActualizar = null;
    if (refetch) this.overlayBus.refetchZonas$.next();
  }

  cerrarComprobante() {
    this.mostrarComprobante = false;
    this.comprobanteSrc = null;
  }
}
