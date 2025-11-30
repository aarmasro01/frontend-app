import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UiService } from '../services/ui';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // 👇 Se importan explícitamente los componentes Ionic usados
    IonButton,
    IonContent,
  ]
})
export class RegistrarUsuarioComponent implements OnInit {
  @Output() cerrarRegistro = new EventEmitter<void>();

  nombre = '';
  correo = '';
  telefono = '';
  rol: number = 1;
  password = '';
  confirmar = '';

  http = inject(HttpClient);
  alertCtrl = inject(AlertController);
  uiService = inject(UiService)

  constructor() {}

  ngOnInit() {}

  cerrar() {
    this.cerrarRegistro.emit();
  }

  async registrar() {
    if (this.password !== this.confirmar) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const res: any = await this.http.post('https://backend-app-fa5c.onrender.com/api/auth/register', {
        nombreCompleto: this.nombre,
        correo: this.correo,
        telefono: this.telefono,
        idRolUsuario: this.rol,
        password: this.password
      }).toPromise();

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: res.message || 'Usuario creado correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.uiService.notificarUsuarioAgregado();
      this.cerrarRegistro.emit(); // 👈 vuelve a la lista
    } catch (err: any) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.error?.error || 'Ocurrió un error al registrar',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
