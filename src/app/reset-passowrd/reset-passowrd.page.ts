import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonInput, IonLabel, IonContent, IonHeader, IonFooter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-passowrd',
  templateUrl: './reset-passowrd.page.html',
  styleUrls: ['./reset-passowrd.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonInput, IonLabel, IonContent, IonHeader, IonFooter]
})
export class ResetPassowrdPage{

  newPassword = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    try {
      const response = await fetch('https://backend-app-fa5c.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: this.newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Contraseña actualizada correctamente.');
        this.router.navigateByUrl('/login');
      } else {
        alert(data.message || 'Error al actualizar la contraseña.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema de conexión. Intenta más tarde.');
    }
  }

}
