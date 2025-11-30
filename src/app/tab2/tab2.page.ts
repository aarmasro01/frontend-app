import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon, CommonModule 
  ],
})
export class Tab2Page implements OnInit {

  carrito: any[] = [];
  subtotal = 0;
  delivery = 5;
  total = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe((data) => {
      this.carrito = data;
      this.calcularTotal();
    });
  }

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
      this.calcularTotal();
    } else {
      this.carrito = [];
    }
  }

  eliminarItem(idProducto: number) {
  this.carritoService.eliminarProducto(idProducto);
  console.log(this.carrito)
}

  aumentarCantidad(item: any, index: number) {
    const nuevaCantidad = (item.cantidad || 1) + 1;
    this.carritoService.actualizarCantidad(index, nuevaCantidad);
  }

  disminuirCantidad(item: any, index: number) {
    const nuevaCantidad = (item.cantidad || 1) - 1;
    if (nuevaCantidad >= 1) {
      this.carritoService.actualizarCantidad(index, nuevaCantidad);
    }
  }

  calcularTotal() {
    this.subtotal = this.carrito.reduce(
      (acc, item) => acc + item.precio * (item.cantidad || 1),
      0
    );
    this.total = this.subtotal + this.delivery;
  }
}