import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleFeaturesComponent } from './edit-multiple-features.component';

describe('EditMultipleFeaturesComponent', () => {
  let component: EditMultipleFeaturesComponent;
  let fixture: ComponentFixture<EditMultipleFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMultipleFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
