import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRulesDialogComponent } from './accept-rules-dialog.component';

describe('AcceptRulesDialogComponent', () => {
  let component: AcceptRulesDialogComponent;
  let fixture: ComponentFixture<AcceptRulesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptRulesDialogComponent ]
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
