import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private router: Router, private alertCtrl: AlertController) {}

  async login() {
    try {
      const response = await fetch('https://backend-app-fa5c.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('carrito', JSON.stringify([]));
        localStorage.setItem('rolUsuario', data.usuario.idRolUsuario);

        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: data.message || 'Inicio de sesión exitoso',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: data.message || 'Credenciales inválidas',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error de conexión',
        message: 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}

