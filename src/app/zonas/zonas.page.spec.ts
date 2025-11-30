import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZonasPage } from './zonas.page';

describe('ZonasPage', () => {
  let component: ZonasPage;
  let fixture: ComponentFixture<ZonasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
