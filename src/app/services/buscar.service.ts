import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscarService {
  private textoBuscar = new BehaviorSubject<string>('');
  textoBuscar$ = this.textoBuscar.asObservable();

  actualizarTexto(texto: string) {
    this.textoBuscar.next(texto);
  }
}
