import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

addIcons({ close });

@Component({
  selector: 'app-comprobante',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './comprobante.component.html',
  styleUrls: ['./comprobante.component.scss'],
})
export class ComprobanteComponent {
  @Input() src: string | null = null;
  @Output() cerrar = new EventEmitter<void>();

  onClose() {
    this.cerrar.emit();
  }
}