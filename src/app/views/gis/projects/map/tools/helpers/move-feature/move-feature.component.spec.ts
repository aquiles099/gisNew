import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveFeatureComponent } from './move-feature.component';

describe('MoveFeatureComponent', () => {
  let component: MoveFeatureComponent;
  let fixture: ComponentFixture<MoveFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
