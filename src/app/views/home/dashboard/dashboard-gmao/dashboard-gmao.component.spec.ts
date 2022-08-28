import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGmaoComponent } from './dashboard-gmao.component';

describe('DashboardGmaoComponent', () => {
  let component: DashboardGmaoComponent;
  let fixture: ComponentFixture<DashboardGmaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardGmaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGmaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
