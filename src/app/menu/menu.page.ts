import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,     // 👈 solo esto agrega soporte para <ion-icon>
    CommonModule // 👈 necesario para *ngFor, *ngIf
  ],
})
export class MenuPage implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];

  constructor(private http: HttpClient, private alertCtrl: AlertController, private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe((data) => {
      this.carrito = data;
    });
    this.obtenerProductos();
    this.cargarCarrito();
    console.log(this.carrito)
  }

  async obtenerProductos() {
    try {
      const data: any = await this.http
        .get('https://backend-app-fa5c.onrender.com/api/products/')
        .toPromise();
      this.productos = data;
    } catch (err) {
      console.error(err);
    }
  }

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    } else {
      this.carrito = [];
    }
  }

  obtenerPorCategoria(categoria: number) {
    return this.productos.filter(
      (p) => p.idCategoriaMenu === categoria && p.idEstadoProducto === 1
    );
  }

  async agregarAlCarrito(pro: any) {
  const existe = this.carrito.some(item => item.idProducto === pro.idProducto);

  if (!existe) {
    this.carrito.push(pro);
    this.carritoService.agregarProducto(pro); // ✅ guarda el carrito
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

  console.log(this.carrito);
}
}
