import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTellinkComponent } from './dashboard-tellink.component';

describe('DashboardTellinkComponent', () => {
  let component: DashboardTellinkComponent;
  let fixture: ComponentFixture<DashboardTellinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTellinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTellinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
