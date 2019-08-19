import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreReadyUpButtonComponent } from './pre-ready-up-button.component';

describe('PreReadyUpButtonComponent', () => {
  let component: PreReadyUpButtonComponent;
  let fixture: ComponentFixture<PreReadyUpButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreReadyUpButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreReadyUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
