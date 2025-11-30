import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosRepartidorPage } from './pedidos-repartidor.page';

describe('PedidosRepartidorPage', () => {
  let component: PedidosRepartidorPage;
  let fixture: ComponentFixture<PedidosRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
