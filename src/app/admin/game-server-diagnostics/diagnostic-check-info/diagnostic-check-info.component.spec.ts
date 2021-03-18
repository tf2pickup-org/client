import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticCheckInfoComponent } from './diagnostic-check-info.component';

describe('DiagnosticCheckInfoComponent', () => {
  let component: DiagnosticCheckInfoComponent;
  let fixture: ComponentFixture<DiagnosticCheckInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosticCheckInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticCheckInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
