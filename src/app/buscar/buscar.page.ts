import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { cartOutline } from 'ionicons/icons';
import { BuscarService } from '../services/buscar.service';
import { CarritoService } from '../services/carrito.service';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule],
})
export class BuscarPage implements OnInit, OnDestroy {
  productos: any[] = [];
  carrito: any[] = [];
  subscripcion!: Subscription;

  constructor(
    private http: HttpClient,
    private buscarService: BuscarService,
    private carritoService: CarritoService,
    private alertCtrl: AlertController
  ) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
    // Suscribirse al texto del buscador
    this.subscripcion = this.buscarService.textoBuscar$.subscribe(texto => {
      if (texto === '') {
        this.productos = [];
      } else {
        this.buscarProductos(texto);
      }
    });

    // Cargar el carrito actual desde el servicio
    this.carritoService.carrito$.subscribe((data) => {
      this.carrito = data;
    });
  }

  ngOnDestroy() {
    if (this.subscripcion) this.subscripcion.unsubscribe();
  }

  buscarProductos(texto: string) {
    this.http.get<any[]>('https://backend-app-fa5c.onrender.com/api/products/').subscribe({
      next: (data) => {
        const filtrados = data.filter(p =>
          p.nombre.toLowerCase().includes(texto.toLowerCase())
        );
        this.productos = filtrados.map((p) => ({
          ...p,
          imagenProductoUrl: `${p.imagenProducto}`,
        }));
      },
      error: (err) => console.error('Error al buscar productos:', err),
    });
  }

  async agregarAlCarrito(pro: any) {
    const existe = this.carrito.some(item => item.idProducto === pro.idProducto);

    if (!existe) {
      this.carrito.push(pro);
      this.carritoService.agregarProducto(pro); // ✅ guarda en el servicio y localStorage

      const alert = await this.alertCtrl.create({
        header: 'Agregado',
        message: 'Se agregó correctamente al carrito.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Aviso',
        message: 'Este producto ya está en el carrito.',
        buttons: ['OK']
      });
      await alert.present();
    }

    console.log('🛒 Carrito actual:', this.carrito);
  }
}
