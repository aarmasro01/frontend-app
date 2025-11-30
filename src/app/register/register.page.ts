import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { person, mail, call, lockClosed } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonText,
    IonIcon
  ]
})
export class RegisterPage {
  nombreCompleto = '';
  correo = '';
  telefono = '';
  password = '';
  confirmarPassword = '';
  aceptarTerminos = false;

  public router = inject(Router);

  constructor() {
    addIcons({ person, mail, call, lockClosed });
  }

  async obtenerUltimoIdUsuario(): Promise<number> {
    const res = await fetch('https://backend-app-fa5c.onrender.com/api/auth/ultimo');
    const data = await res.json();
    return data.idUsuario;
  }

  async crearCliente(nombre: string, email: string, telefono: string) {
    const cliente = {
      idUsuario: await this.obtenerUltimoIdUsuario(),
      nombreCompleto: nombre,
      correo: email,
      telefono: telefono,
    };
    console.log(cliente);
    return cliente;
  }

  async registrarCliente(cliente: any) {
    try {
      const res = await fetch('https://backend-app-fa5c.onrender.com/api/clientes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      alert('Hubo un problema de conexión. Por favor, intenta de nuevo.');
    }
  }

  async registrarUsuario() {
    if (this.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    if (!this.aceptarTerminos) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const response = await fetch('https://backend-app-fa5c.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: this.nombreCompleto,
          correo: this.correo,
          password: this.password,
          telefono: this.telefono,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        const cliente = await this.crearCliente(this.nombreCompleto, this.correo, this.telefono);
        await this.registrarCliente(cliente);
        this.router.navigate(['/login']);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Hubo un problema de conexión. Por favor, intenta de nuevo.');
    }
  }
}
