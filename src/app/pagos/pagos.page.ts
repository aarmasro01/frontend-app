import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonList, IonButton, IonIcon, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { PagosService, Pago } from '../services/pagos.service';
import { addIcons } from 'ionicons';
import { searchOutline, imagesOutline, funnelOutline } from 'ionicons/icons';
import { TabsOverlayBusService } from '../services/tabs-overlay-bus.service';
import { firstValueFrom } from 'rxjs';

addIcons({ searchOutline, imagesOutline, funnelOutline });

@Component({
  selector: 'app-pagos-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonList, IonButton, IonIcon, IonSelect, IonSelectOption
  ],
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage {
  private pagosSvc = inject(PagosService);
  private overlayBus = inject(TabsOverlayBusService);

  // Filters
  idBuscar = signal<string>('');
  metodoBuscar = signal<string>(''); // '', 'Yape', 'Plin'
  fechaBuscar = signal<string>('');  // 'YYYY-MM-DD'

  pagos = signal<Array<Pago>>([]);

  pagosFiltrados = computed(() => {
    const all = this.pagos();
    return this.pagosSvc.filtrar(all, this.idBuscar(), this.metodoBuscar(), this.fechaBuscar());
  });

  trackByPago(index: number, item: Pago) {
    return item.idPago;
  }

  constructor() {
    this.cargar();
    // Optional: hook if you add a refetch bus later
    this.overlayBus.refetchPagos$?.subscribe?.(() => this.cargar());
  }

  async cargar() {
    try {
      const data = await firstValueFrom(this.pagosSvc.listar());
      this.pagos.set(data ?? []);
    } catch (e) {
      console.error(e);
      this.pagos.set([]);
    }
  }

  onBuscarId(ev: any) {
  const value = ev.target.value;
  this.idBuscar.set(value);
}

  onCambiarMetodo(metodo: string) {
    this.metodoBuscar.set(metodo);
  }
  onCambiarFecha(ev: Event) {
    const value = (ev.target as HTMLInputElement)?.value ?? '';
    this.fechaBuscar.set(String(value));
  }

  abrirComprobante(p: Pago) {
    // Build absolute/relative URL for image
    // Original used ../../Backend/IMAGES/COMPROBANTES/<file>
    const src = `${p.comprobantePago}`;
    this.overlayBus.openComprobante$.next(src);
  }
}