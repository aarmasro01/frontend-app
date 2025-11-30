import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, AlertController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ZonasService, CrearZonaDto } from '../services/zona.services';

@Component({
  selector: 'app-registrar-zona',
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonInput, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent],
  templateUrl: './registrar-zona.component.html',
  styleUrls: ['./registrar-zona.component.scss'],
})
export class RegistrarZonaComponent {
  @Output() cerrarRegistro = new EventEmitter<void>();
  @Output() registroExitoso = new EventEmitter<void>();

  distrito = '';
  costoEnvio: number | null = null;

  private alertCtrl = inject(AlertController);

  constructor(private zonasSvc: ZonasService) {}

  cerrar() {
    this.cerrarRegistro.emit();
  }

  async onSubmit() {
    if (!this.distrito?.trim() || this.costoEnvio === null || isNaN(this.costoEnvio)) {
      return;
    }

    const dto: CrearZonaDto = {
      distrito: this.distrito.trim(),
      costoEnvio: Number(this.costoEnvio)
    };

    try {
      const res: any = await this.zonasSvc.crear(dto).toPromise();

      // ✅ ALERTA DE ZONA REGISTRADA
      const alert = await this.alertCtrl.create({
        header: '✅ Zona registrada',
        message: res?.message || 'La zona fue registrada correctamente.',
        buttons: ['OK']
      });

      await alert.present();

      this.registroExitoso.emit();
      this.cerrar();

    } catch (err: any) {
      console.error(err);

      // ❌ ALERTA DE ERROR
      const alert = await this.alertCtrl.create({
        header: '❌ Error',
        message: err.error?.message || 'Ocurrió un error al registrar la zona.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }
}
