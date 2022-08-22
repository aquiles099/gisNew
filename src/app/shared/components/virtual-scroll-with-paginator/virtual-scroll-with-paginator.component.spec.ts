import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollWithPaginatorComponent } from './virtual-scroll-with-paginator.component';

describe('VirtualScrollWithPaginatorComponent', () => {
  let component: VirtualScrollWithPaginatorComponent;
  let fixture: ComponentFixture<VirtualScrollWithPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualScrollWithPaginatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScrollWithPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
