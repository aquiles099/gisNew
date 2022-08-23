import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuminairesPerCmComponent } from './luminaires-per-cm.component';

describe('LuminairesPerCmComponent', () => {
  let component: LuminairesPerCmComponent;
  let fixture: ComponentFixture<LuminairesPerCmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuminairesPerCmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuminairesPerCmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
