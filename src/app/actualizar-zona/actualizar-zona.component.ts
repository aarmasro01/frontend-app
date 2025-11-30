
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, AlertController  } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ZonasService, Zona, ActualizarZonaDto } from '../services/zona.services';

@Component({
  selector: 'app-actualizar-zona',
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonInput, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent],
  templateUrl: './actualizar-zona.component.html',
  styleUrls: ['./actualizar-zona.component.scss'],
})
export class ActualizarZonaComponent implements OnChanges {
  @Input() zona!: Zona | null;
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Output() actualizadoExitoso = new EventEmitter<void>();

  distrito = '';
  costoEnvio: number | null = null;

  private alertCtrl = inject(AlertController);

  constructor(private zonasSvc: ZonasService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zona']?.currentValue) {
      this.distrito = this.zona?.distrito ?? '';
      this.costoEnvio = this.zona?.costoEnvio ?? null;
    }
  }

  cerrar() {
    this.cerrarActualizar.emit();
  }

  async onSubmit() {
    if (!this.zona) return;
    if (!this.distrito?.trim() || this.costoEnvio === null || isNaN(this.costoEnvio)) {
      return;
    }
    const dto: ActualizarZonaDto = {
      distrito: this.distrito.trim(),
      costoEnvio: Number(this.costoEnvio)
    };
    try {
      const res: any = await this.zonasSvc.actualizar(this.zona.idZona, dto).toPromise();

      // ALERTA DE ÉXITO
      const alert = await this.alertCtrl.create({
        header: '✅ Éxito',
        message: res?.message || 'Zona actualizada correctamente',
        buttons: ['OK']
      });

      await alert.present();

      this.actualizadoExitoso.emit();
      this.cerrar();

    } catch (err: any) {
      console.error(err);

      // ALERTA DE ERROR
      const alert = await this.alertCtrl.create({
        header: '❌ Error',
        message: err.error?.message || 'Ocurrió un error al actualizar la zona',
        buttons: ['OK']
      });

      await alert.present();
    }
  }
}
