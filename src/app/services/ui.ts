import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private mostrarRegistroSource = new BehaviorSubject<boolean>(false);
  mostrarRegistro$ = this.mostrarRegistroSource.asObservable();

  private usuarioAgregadoSource = new Subject<void>();
  usuarioAgregado$ = this.usuarioAgregadoSource.asObservable();

  private mostrarActualizarSource = new BehaviorSubject<any | null>(null);
  mostrarActualizar$ = this.mostrarActualizarSource.asObservable();

  private usuarioActualizadoSource = new Subject<void>();
  usuarioActualizado$ = this.usuarioActualizadoSource.asObservable();

  mostrarRegistrarUsuario() {
    this.mostrarRegistroSource.next(true);
  }

  ocultarRegistrarUsuario() {
    this.mostrarRegistroSource.next(false);
  }

  notificarUsuarioAgregado() {
    this.usuarioAgregadoSource.next();
  }

  notificarUsuarioActualizado() {
    this.usuarioActualizadoSource.next();
  }

  mostrarActualizarUsuario(usuario: any) {
    this.mostrarActualizarSource.next(usuario);
  }

  ocultarActualizarUsuario() {
    this.mostrarActualizarSource.next(null);
  }
}
