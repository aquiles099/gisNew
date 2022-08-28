import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsContentComponent } from './graphics-content.component';

describe('GraphicsContentComponent', () => {
  let component: GraphicsContentComponent;
  let fixture: ComponentFixture<GraphicsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicsContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
