import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGestionEnergeticaComponent } from './dashboard-gestion-energetica.component';

describe('DashboardGestionEnergeticaComponent', () => {
  let component: DashboardGestionEnergeticaComponent;
  let fixture: ComponentFixture<DashboardGestionEnergeticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardGestionEnergeticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGestionEnergeticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
