import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyFeatureComponent } from './copy-feature.component';

describe('CopyFeatureComponent', () => {
  let component: CopyFeatureComponent;
  let fixture: ComponentFixture<CopyFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
