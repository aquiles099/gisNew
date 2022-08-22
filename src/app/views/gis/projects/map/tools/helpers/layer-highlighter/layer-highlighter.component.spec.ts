import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerHighlighterComponent } from './layer-highlighter.component';

describe('LayerHighlighterComponent', () => {
  let component: LayerHighlighterComponent;
  let fixture: ComponentFixture<LayerHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayerHighlighterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
