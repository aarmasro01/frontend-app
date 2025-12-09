import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class PerfilUsuarioPage implements OnInit {

  rolUsuario: number | null = null;
  
  usuario: any = {
    imagenPerfil: 'assets/img/default-user.png',
    nombreCompleto: 'Usuario Ejemplo',
    correo: 'usuario@ejemplo.com',
    telefono: '999 999 999',
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) this.usuario = JSON.parse(data);
    const rol = localStorage.getItem('rolUsuario');
    this.rolUsuario = rol ? parseInt(rol, 10) : null;
  }

  irAMisPedidos() {
    this.router.navigate(['/tabs/historial']);
  }

  cerrarSesion() {
    // 1. 🆕 USAR EL SERVICIO PARA ELIMINAR LOS DATOS Y NOTIFICAR
    this.authService.logout(); 

    // 2. Eliminar las claves restantes que no maneja el servicio (si son necesarias)
    localStorage.removeItem('carrito'); 
    
    // 3. Redirigir al usuario
    this.router.navigate(['/login']);
}
}
