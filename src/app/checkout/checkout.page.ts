import { Component, OnInit } from '@angular/core';
import { IonContent, IonButton, IonInput, IonItem, IonCheckbox, IonList, IonLabel, IonTitle, IonToolbar, IonHeader, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButton, IonInput, IonItem, IonCheckbox,
    IonList, IonLabel, IonTitle, IonToolbar, IonHeader,
    IonButtons, IonBackButton, CommonModule, FormsModule
  ],
})
export class CheckoutPage implements OnInit {

  cliente = {
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    telefono: '',
    direccion: '',
    politica: false,
    comprobante: ''
  };

  comprobantes = [
    { label: 'Boleta electrónica', value: 'Boleta electrónica', checked: false },
    { label: 'Boleta simple', value: 'Boleta simple', checked: false },
    { label: 'Factura', value: 'Factura', checked: false }
  ];

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {}

  seleccionarComprobante(selected: any) {
    this.comprobantes.forEach(c => {
      if (c !== selected) c.checked = false;
    });
    this.cliente.comprobante = selected.value;
  }

  async continuar() {
    if (!this.validarCampos()) return;

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario.idUsuario;

    const idCliente = await this.obtenerIdCliente(idUsuario);
    const clienteData = { ...this.cliente, idUsuario, idCliente };

    localStorage.setItem('clientePedido', JSON.stringify(clienteData));

    const alert = await this.alertCtrl.create({
      header: 'Correcto',
      message: 'Datos guardados correctamente',
      buttons: ['OK']
    });
    await alert.present();

    this.router.navigate(['/pago']);
  }

  validarCampos(): boolean {
    const c = this.cliente;

    if (!c.nombres || !c.apellidos || !c.dni || !c.correo || !c.telefono || !c.direccion) {
      this.mostrarAlerta('Rellene todos los campos.');
      return false;
    }

    if (c.dni.length !== 8) {
      this.mostrarAlerta('Coloque correctamente su DNI.');
      return false;
    }

    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(c.correo)) {
      this.mostrarAlerta('Coloque correctamente su correo (debe ser Gmail).');
      return false;
    }

    if (c.telefono.length !== 9) {
      this.mostrarAlerta('Coloque correctamente su teléfono.');
      return false;
    }

    if (!c.comprobante) {
      this.mostrarAlerta('Seleccione un comprobante de pago.');
      return false;
    }

    if (!c.politica) {
      this.mostrarAlerta('Debe aceptar los términos y condiciones.');
      return false;
    }

    return true;
  }

  async mostrarAlerta(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async obtenerIdCliente(idUsuario: number) {
    try {
      const res: any = await this.http.get(`https://backend-app-fa5c.onrender.com/api/clientes/usuario/${idUsuario}`).toPromise();
      return res.idCliente;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

}
