import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolSidebarComponent } from './tool-sidebar.component';

describe('ToolSidebarComponent', () => {
  let component: ToolSidebarComponent;
  let fixture: ComponentFixture<ToolSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
