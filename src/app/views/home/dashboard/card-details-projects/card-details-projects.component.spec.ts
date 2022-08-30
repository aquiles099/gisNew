import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailsProjectsComponent } from './card-details-projects.component';

describe('CardDetailsProjectsComponent', () => {
  let component: CardDetailsProjectsComponent;
  let fixture: ComponentFixture<CardDetailsProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDetailsProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailsProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
