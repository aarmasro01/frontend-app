import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class PerfilUsuarioPage implements OnInit {

  usuario: any = {
    imagenPerfil: 'assets/img/default-user.png',
    nombreCompleto: 'Usuario Ejemplo',
    correo: 'usuario@ejemplo.com',
    telefono: '999 999 999',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí podrías cargar los datos reales desde localStorage o backend
    const data = localStorage.getItem('usuario');
    if (data) this.usuario = JSON.parse(data);
  }

  irAMisPedidos() {
    this.router.navigate(['/tabs/historial']);
  }

  cerrarSesion(){
    this.router.navigate(['/login'])
  }

}
