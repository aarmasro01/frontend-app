import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../services/productos.service';

@Component({
  selector: 'app-actualizar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-producto.component.html',
  styleUrls: ['./actualizar-producto.component.scss']
})
export class ActualizarProductoComponent implements OnChanges {
  @Input() producto!: Producto;
  @Output() cerrarActualizar = new EventEmitter<boolean>();

  private productosService = inject(ProductosService);

  idProducto!: number;
  nombre = '';
  precio: number | null = null;
  idCategoriaMenu = 1;
  idEstadoProducto = 1;
  imagenActualSrc = '';
  nuevaImagenFile: File | null = null;
  nuevaPreview: string | null = null;

  enviando = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto'] && this.producto) {
      this.idProducto = this.producto.idProducto;
      this.nombre = this.producto.nombre;
      this.precio = this.producto.precio;
      this.idCategoriaMenu = this.producto.idCategoriaMenu;
      this.idEstadoProducto = this.producto.idEstadoProducto;
      this.imagenActualSrc = this.producto.imagenProducto;
      this.nuevaImagenFile = null;
      this.nuevaPreview = null;
    }
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    this.nuevaImagenFile = file ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => (this.nuevaPreview = String(e.target?.result || ''));
      reader.readAsDataURL(file);
    } else {
      this.nuevaPreview = null;
    }
  }

  async actualizar() {
    if (!this.nombre || this.precio == null) {
      alert('Complete nombre y precio');
      return;
    }
    try {
      this.enviando = true;
      await this.productosService.actualizarProducto(this.idProducto, {
        idCategoriaMenu: this.idCategoriaMenu,
        nombre: this.nombre.trim(),
        precio: Number(this.precio),
        idEstadoProducto: this.idEstadoProducto,
        imagenFile: this.nuevaImagenFile ?? undefined
      });
      alert('Producto actualizado');
      this.cerrarActualizar.emit(true);
    } catch (e: any) {
      console.error(e);
      alert(e?.error || 'Error al actualizar producto');
      this.cerrarActualizar.emit(false);
    } finally {
      this.enviando = false;
    }
  }

  cancelar() {
    this.cerrarActualizar.emit(false);
  }
}