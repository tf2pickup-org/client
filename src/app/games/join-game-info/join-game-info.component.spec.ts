import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinGameInfoComponent } from './join-game-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConnectStringToLinkPipe } from '@app/shared/connect-string-to-link.pipe';

describe('JoinGameInfoComponent', () => {
  let component: JoinGameInfoComponent;
  let fixture: ComponentFixture<JoinGameInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConnectStringToLinkPipe,
        JoinGameInfoComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA, ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
