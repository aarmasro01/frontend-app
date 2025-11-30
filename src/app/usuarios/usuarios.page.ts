import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../services/ui';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = [];
  http = inject(HttpClient);
  alertCtrl = inject(AlertController);

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.mostrarUsuarios();
    this.uiService.usuarioAgregado$.subscribe(() => {
      this.mostrarUsuarios();
    });
    this.uiService.usuarioActualizado$.subscribe(() => {
    this.mostrarUsuarios();
  });
  }

  async obtenerUsuarios() {
    try {
      const data: any = await this.http.get('https://backend-app-fa5c.onrender.com/api/auth/usuarios').toPromise();
      this.usuarios = data;
    } catch (err) {
      console.error(err);
    }
  }

  async mostrarUsuarios() {
    await this.obtenerUsuarios();
  }

  abrirRegistro() {
    this.uiService.mostrarRegistrarUsuario();
  }

  editarUsuario(usuario: any) {
    this.uiService.mostrarActualizarUsuario(usuario);
  }

  async eliminarUsuario(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Seguro que quieres eliminar este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: async () => {
          try {
            await this.http.delete(`http://localhost:5000/api/auth/usuarios/${id}`).toPromise();
            this.mostrarUsuarios();
          } catch (err) {
            console.error(err);
          }
        }}
      ]
    });
    await alert.present();
  }

  rolUsuario(id: number) {
    switch (id) {
      case 1: return 'Cliente';
      case 6: return 'Encargado';
      case 7: return 'Empleado';
      case 8: return 'Repartidor';
      default: return '';
    }
  }
}
