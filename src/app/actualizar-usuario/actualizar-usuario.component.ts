import { Component, OnInit, Input, inject, Output, EventEmitter } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UiService } from '../services/ui';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ActualizarUsuarioComponent implements OnInit {
  @Input() usuario: any;
  @Output() cerrarActualizar = new EventEmitter<void>();

  idUsuario!: number;
  nombre = '';
  correo = '';
  telefono = '';
  rol: number = 1;
  contrasena = '';

  http = inject(HttpClient);
  uiService = inject(UiService)
  alertCtrl = inject(AlertController);

  ngOnInit() {
    // 🔹 Simula el comportamiento de rellenarModalActualizar(user)
    if (this.usuario) {
      this.idUsuario = this.usuario.idUsuario;
      this.nombre = this.usuario.nombreCompleto;
      this.correo = this.usuario.correo;
      this.telefono = this.usuario.telefono;
      this.rol = this.usuario.idRolUsuario;
      this.contrasena = this.usuario.contraseña;
    }
  }

  cerrar() {
    this.cerrarActualizar.emit();
  }

  async actualizar() {
    try {
      const usuarioActualizado = {
        nombreCompleto: this.nombre,
        correo: this.correo,
        telefono: this.telefono,
        idRolUsuario: this.rol,
        contraseña: this.contrasena
      };

      console.log('Enviando datos actualizados:', usuarioActualizado);

      const res: any = await this.http
        .put(`https://backend-app-fa5c.onrender.com/api/auth/usuarios/${this.idUsuario}`, usuarioActualizado)
        .toPromise();

      const alert = await this.alertCtrl.create({
        header: '✅ Éxito',
        message: res.message || 'Usuario actualizado correctamente',
        buttons: ['OK']
      });

      await alert.present();
      this.uiService.notificarUsuarioActualizado();
      this.cerrarActualizar.emit(); // 🔹 Devuelve señal para refrescar lista

    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      const alert = await this.alertCtrl.create({
        header: '❌ Error',
        message: err.error?.error || 'Ocurrió un error al actualizar el usuario',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
