import { Component, EventEmitter, Output, inject } from '@angular/core'; import { CommonModule } from '@angular/common'; import { FormsModule } from '@angular/forms'; import { ProductosService } from '../services/productos.service';

@Component({ selector: 'app-registrar-producto', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './registrar-producto.component.html', styleUrls: ['./registrar-producto.component.scss'] }) export class RegistrarProductoComponent { @Output() cerrarRegistro = new EventEmitter();

nombre = ''; precio: number | null = null; idCategoriaMenu = 1; idEstadoProducto = 1; imagenFile: File | null = null; previewDataUrl: string | null = null; enviando = false;
private productosService = inject(ProductosService);
// Inyección estándar del servicio private productosService = inject(ProductosService);

async onFileChange(ev: Event) { const input = ev.target as HTMLInputElement; const file = input.files && input.files[0]; this.imagenFile = file ?? null; if (file) { const reader = new FileReader(); reader.onload = e => (this.previewDataUrl = String(e.target?.result || '')); reader.readAsDataURL(file); } else { this.previewDataUrl = null; } }

async guardar() { if (!this.nombre || this.precio == null) { alert('Complete nombre y precio'); return; } try { this.enviando = true;

  await this.productosService.crearProducto({
    idCategoriaMenu: this.idCategoriaMenu,
    nombre: this.nombre.trim(),
    precio: Number(this.precio),
    idEstadoProducto: this.idEstadoProducto,
    imagenFile: this.imagenFile ?? undefined
  });

  alert('Producto creado');
  this.cerrarRegistro.emit(true);
} catch (e: any) {
  console.error(e);
  alert(e?.error || 'Error al crear producto');
  this.cerrarRegistro.emit(false);
} finally {
  this.enviando = false;
}




}
cancelar() { this.cerrarRegistro.emit(false); }
}