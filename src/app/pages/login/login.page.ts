import { Component, NgZone, ChangeDetectorRef } from '@angular/core'; // <-- ¡Importa ChangeDetectorRef!
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

  // Inyecta NgZone y ChangeDetectorRef en el constructor
  constructor(
    private router: Router, 
    private alertCtrl: AlertController, 
    private zone: NgZone, // Necesario por usar fetch()
    private cdr: ChangeDetectorRef // <-- ¡Nueva inyección de ChangeDetectorRef!
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
        localStorage.setItem('rolUsuario', data.usuario.idRolUsuario);

        // Ejecuta las operaciones de UI/Routing dentro de la zona de Angular
        this.zone.run(async () => {
            // FIX CLAVE: Forzamos la detección de cambios para desbloquear la UI y el Router
            this.cdr.detectChanges();
            
            // 2. Muestra la alerta de éxito
            const alert = await this.alertCtrl.create({
              header: 'Éxito',
              message: data.message || 'Inicio de sesión exitoso',
              buttons: ['OK']
            });
            await alert.present();

            // 3. Espera a que la alerta se cierre antes de navegar
            await alert.onDidDismiss(); 

            // 4. Navega a la ruta /tabs
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
        });

      } else {
        // Error de credenciales (response.status no es 2xx)
        this.zone.run(async () => {
            this.cdr.detectChanges(); // Forzamos detección de cambios en el caso de error también
            const alert = await this.alertCtrl.create({
              header: 'Error',
              message: data.message || 'Credenciales inválidas',
              buttons: ['OK']
            });
            await alert.present();
        });
      }
    } catch (error) {
      // Error de conexión (falla de red o servidor no responde)
      this.zone.run(async () => {
          this.cdr.detectChanges(); // Forzamos detección de cambios en el caso de fallo de conexión
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