import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinButtonComponent } from './join-button.component';

describe('JoinButtonComponent', () => {
  let component: JoinButtonComponent;
  let fixture: ComponentFixture<JoinButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
