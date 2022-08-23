import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadExternalFileComponent } from './load-external-file.component';

describe('LoadExternalFileComponent', () => {
  let component: LoadExternalFileComponent;
  let fixture: ComponentFixture<LoadExternalFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadExternalFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadExternalFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
