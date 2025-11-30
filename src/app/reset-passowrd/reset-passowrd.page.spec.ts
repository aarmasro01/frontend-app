import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPassowrdPage } from './reset-passowrd.page';

describe('ResetPassowrdPage', () => {
  let component: ResetPassowrdPage;
  let fixture: ComponentFixture<ResetPassowrdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassowrdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
