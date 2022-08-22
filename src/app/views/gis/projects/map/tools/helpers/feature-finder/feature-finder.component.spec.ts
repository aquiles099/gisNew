import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureFinderComponent } from './feature-finder.component';

describe('FeatureFinderComponent', () => {
  let component: FeatureFinderComponent;
  let fixture: ComponentFixture<FeatureFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
