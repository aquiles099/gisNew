import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureGaleryComponent } from './feature-galery.component';

describe('FeatureGaleryComponent', () => {
  let component: FeatureGaleryComponent;
  let fixture: ComponentFixture<FeatureGaleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureGaleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureGaleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
