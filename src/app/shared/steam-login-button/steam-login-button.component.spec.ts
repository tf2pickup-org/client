import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamLoginButtonComponent } from './steam-login-button.component';

describe('SteamLoginButtonComponent', () => {
  let component: SteamLoginButtonComponent;
  let fixture: ComponentFixture<SteamLoginButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteamLoginButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
