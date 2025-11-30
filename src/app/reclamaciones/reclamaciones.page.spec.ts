import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReclamacionesPage } from './reclamaciones.page';

describe('ReclamacionesPage', () => {
  let component: ReclamacionesPage;
  let fixture: ComponentFixture<ReclamacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
