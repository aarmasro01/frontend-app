import { Component, NgZone, ChangeDetectorRef } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private router: Router, 
    private alertCtrl: AlertController, 
    private zone: NgZone, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService 
  ) {}

  async login() {
    try {
      // 1. Realiza la solicitud fetch
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
        // Almacenamiento local de datos
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('carrito', JSON.stringify([]));
//         localStorage.setItem('rolUsuario', data.usuario.idRolUsuario);
        const rolId = parseInt(data.usuario.idRolUsuario, 10);
        this.authService.setRolUsuario(rolId);

        // Ejecuta la navegación MÁS SIMPLE y DIRECTA
        this.zone.run(() => {
            this.cdr.detectChanges(); // Asegura la detección de cambios
            
            // 🛑 NAVEGACIÓN DIRECTA: Si el login es exitoso, navegamos inmediatamente.
            this.router.navigate(['/tabs'], { replaceUrl: true });
        });

      } else {
        // Lógica de error de credenciales (MANTENEMOS la alerta)
        this.zone.run(async () => {
            this.cdr.detectChanges(); 
            const alert = await this.alertCtrl.create({
              header: 'Error',
              message: data.message || 'Credenciales inválidas',
              buttons: ['OK']
            });
            await alert.present();
        });
      }
    } catch (error) {
      // Lógica de error de conexión
      this.zone.run(async () => {
          this.cdr.detectChanges();
          const alert = await this.alertCtrl.create({
            header: 'Error de conexión',
            message: 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.',
            buttons: ['OK']
          });
          await alert.present();
      });
    }
  }
}