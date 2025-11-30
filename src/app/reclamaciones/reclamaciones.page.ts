import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonContent, AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-reclamaciones',
  templateUrl: './reclamaciones.page.html',
  styleUrls: ['./reclamaciones.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule],
})
export class ReclamacionesPage {

  reclamo: any = {
    idUsuario: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    tipoDocumento: '',
    numDocumento: '',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    montoReclamo: '',
    numPedido: '',
    fechaPedido: '',
    tipoSolicitud: '',
    detalles: ''
  };

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  async enviarReclamo(event: Event) {
    event.preventDefault();

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.idUsuario) {
      this.mostrarAlerta('Error', 'Debe iniciar sesión para registrar un reclamo.');
      return;
    }

    this.reclamo.idUsuario = usuario.idUsuario;

    try {
      const res = await this.http
        .post<any>('https://backend-app-fa5c.onrender.com/api/reclamos/register', this.reclamo)
        .toPromise();

      if (res) {
        this.mostrarAlerta('Éxito', 'Tu reclamo fue enviado correctamente.');
        this.reiniciarFormulario();
      }
    } catch (error) {
      this.mostrarAlerta('Error', 'Ocurrió un error al enviar tu reclamo.');
      console.error(error);
    }
  }

  reiniciarFormulario() {
    this.reclamo = {
      idUsuario: '',
      nombreCompleto: '',
      correo: '',
      telefono: '',
      tipoDocumento: '',
      numDocumento: '',
      departamento: '',
      provincia: '',
      distrito: '',
      direccion: '',
      montoReclamo: '',
      numPedido: '',
      fechaPedido: '',
      tipoSolicitud: '',
      detalles: ''
    };
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alerta = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alerta.present();
  }

}
