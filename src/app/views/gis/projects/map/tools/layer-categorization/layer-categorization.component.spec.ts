import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerCategorizationComponent } from './layer-categorization.component';

describe('LayerCategorizationComponent', () => {
  let component: LayerCategorizationComponent;
  let fixture: ComponentFixture<LayerCategorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayerCategorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerCategorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
