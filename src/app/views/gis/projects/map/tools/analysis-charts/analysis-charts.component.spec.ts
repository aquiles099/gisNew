import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisChartsComponent } from './analysis-charts.component';

describe('AnalysisChartsComponent', () => {
  let component: AnalysisChartsComponent;
  let fixture: ComponentFixture<AnalysisChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
