import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureLabelingComponent } from './feature-labeling.component';

describe('FeatureLabelingComponent', () => {
  let component: FeatureLabelingComponent;
  let fixture: ComponentFixture<FeatureLabelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureLabelingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureLabelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
