import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MumbleJoinButtonComponent } from './mumble-join-button.component';

describe('MumbleJoinButtonComponent', () => {
  let component: MumbleJoinButtonComponent;
  let fixture: ComponentFixture<MumbleJoinButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MumbleJoinButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MumbleJoinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
