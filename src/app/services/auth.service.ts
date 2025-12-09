// auth.service.ts (EJEMPLO)
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject mantiene el valor actual y notifica cambios
  private rolSubject = new BehaviorSubject<number | null>(this.obtenerRolInicial());
  rolUsuario$: Observable<number | null> = this.rolSubject.asObservable();

  constructor() { }

  private obtenerRolInicial(): number | null {
    const rol = localStorage.getItem('rolUsuario');
    return rol ? parseInt(rol, 10) : null;
  }

  // 🆕 Método llamado por el componente Login al iniciar sesión
  setRolUsuario(rol: number) {
    localStorage.setItem('rolUsuario', rol.toString());
    this.rolSubject.next(rol); // Notifica el nuevo rol
  }
  
  // 🆕 Método llamado al cerrar sesión (similar a tu cerrarSesion)
  logout() {
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // ... remover otros ítems ...
    this.rolSubject.next(null); // Notifica que ya no hay rol
  }
}