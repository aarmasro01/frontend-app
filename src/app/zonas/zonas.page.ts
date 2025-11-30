// restaurante/src/app/zonas/zonas.page.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonList, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { ZonasService, Zona } from '../services/zona.services';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline, searchOutline, addCircleOutline } from 'ionicons/icons';
import { TabsOverlayBusService } from '../services/tabs-overlay-bus.service';
import { firstValueFrom } from 'rxjs';

addIcons({ pencilOutline, trashOutline, searchOutline, addCircleOutline });

@Component({
  selector: 'app-zonas-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonList, IonButton, IonIcon
  ],
  templateUrl: './zonas.page.html',
  styleUrls: ['./zonas.page.scss'],
})
export class ZonasPage {

  private zonasSvc = inject(ZonasService);
  private overlayBus = inject(TabsOverlayBusService);

  termino = signal('');
  zonas = signal<Array<Zona>>([]);

  trackByZona(index: number, item: Zona) {
    return item.idZona;
  }

  zonasFiltradas = computed(() => {
    const q = this.termino().trim().toLowerCase();
    const all = this.zonas();
    if (!q) return all;
    return all.filter(z => (z.distrito ?? '').toLowerCase().includes(q));
  });

  constructor() {
    this.cargar();
    this.overlayBus.refetchZonas$.subscribe(() => this.cargar());
  }

  async cargar() {
    try {
      const data = await firstValueFrom(this.zonasSvc.listar());
      this.zonas.set(data ?? []);
    } catch (e) {
      console.error(e);
      this.zonas.set([]);
    }
  }

  onBuscar(ev: CustomEvent) {
    const value = (ev.detail as any)?.value ?? '';
    this.termino.set(String(value));
  }

  abrirRegistrar() {
    this.overlayBus.openRegistrarZona$.next();
  }

  abrirActualizar(z: Zona) {
    this.overlayBus.openActualizarZona$.next(z);
  }

  async eliminar(z: Zona) {
    try {
      await firstValueFrom(this.zonasSvc.eliminar(z.idZona));
      await this.cargar();
    } catch (e) {
      console.error(e);
    }
  }
}
