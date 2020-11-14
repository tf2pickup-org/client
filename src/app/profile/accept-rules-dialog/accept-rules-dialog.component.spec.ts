import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AcceptRulesDialogComponent } from './accept-rules-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AcceptRulesDialogComponent', () => {
  let component: AcceptRulesDialogComponent;
  let fixture: ComponentFixture<AcceptRulesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptRulesDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
