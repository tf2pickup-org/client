import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject } from 'rxjs';
import { addGameServer, gameServerAdded } from '../game-servers.actions';
import { AddGameServerComponent } from './add-game-server.component';

describe('AddGameServerComponent', () => {
  let component: AddGameServerComponent;
  let fixture: ComponentFixture<AddGameServerComponent>;
  let store: MockStore;
  let actions: ReplaySubject<Action>;
  let router: Router;

  beforeEach(() => (actions = new ReplaySubject<Action>(1)));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddGameServerComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions.asObservable()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(AddGameServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => actions.complete());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render save button', () => {
    const saveButton = fixture.debugElement.query(By.css('.save-button'))
      .nativeElement as HTMLButtonElement;
    expect(saveButton).toBeTruthy();
    expect(saveButton.disabled).toBe(true);
  });

  it('should render cancel button', () => {
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
      .nativeElement as HTMLButtonElement;
    expect(cancelButton).toBeTruthy();
  });

  describe('when the form is valid', () => {
    let saveButton: HTMLButtonElement;

    beforeEach(() => {
      const nameInput = fixture.debugElement.query(
        By.css('.name-field input[type=text]'),
      ).nativeElement as HTMLInputElement;
      nameInput.value = 'FAKE_GAME_SERVER_NAME';
      nameInput.dispatchEvent(new Event('input'));

      const addressInput = fixture.debugElement.query(
        By.css('.address-field input[type=text]'),
      ).nativeElement as HTMLInputElement;
      addressInput.value = 'FAKE_GAME_SERVER_ADDRESS';
      addressInput.dispatchEvent(new Event('input'));

      const portInput = fixture.debugElement.query(
        By.css('.port-field input[type=number]'),
      ).nativeElement as HTMLInputElement;
      portInput.value = '27015';
      portInput.dispatchEvent(new Event('input'));

      const rconPasswordInput = fixture.debugElement.query(
        By.css('.rcon-password-field input[type=text]'),
      ).nativeElement as HTMLInputElement;
      rconPasswordInput.value = 'FAKE_GAME_SERVER_RCON_PASSWORD';
      rconPasswordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      saveButton = fixture.debugElement.query(By.css('.save-button'))
        .nativeElement as HTMLButtonElement;
    });

    it('should enable the save button', () => {
      expect(saveButton.disabled).toBe(false);
    });

    describe('when the form is submited', () => {
      const action = gameServerAdded({
        gameServer: {
          name: 'FAKE_GAME_SERVER_NAME',
          address: 'FAKE_GAME_SERVER_ADDRESS',
          port: '27015',
          rconPassword: 'FAKE_GAME_SERVER_RCON_PASSWORD',
        },
      });

      it('should dispatch an event', () => {
        saveButton.click();
        actions.next(action);
        expect(store.dispatch).toHaveBeenCalledWith(
          addGameServer({
            gameServer: {
              name: 'FAKE_GAME_SERVER_NAME',
              address: 'FAKE_GAME_SERVER_ADDRESS',
              port: '27015',
              rconPassword: 'FAKE_GAME_SERVER_RCON_PASSWORD',
            },
          }),
        );
      });

      it('should disable the save button', () => {
        saveButton.click();
        fixture.detectChanges();
        expect(saveButton.disabled).toBe(true);
        actions.next(action);
      });

      it('should eventually go back to the game server list', () => {
        saveButton.click();
        actions.next(action);
        expect(router.navigate).toHaveBeenCalledWith(['/servers']);
      });
    });
  });

  describe('when user presses escape', () => {
    it('should go back in history', () => {
      const spy = spyOn(TestBed.inject(Location), 'back');
      component.onEscDown();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when user presses the cancel button', () => {
    let cancelButton: HTMLButtonElement;

    beforeEach(() => {
      cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
        .nativeElement as HTMLButtonElement;
    });

    it('should go back in history', () => {
      const spy = spyOn(TestBed.inject(Location), 'back');
      cancelButton.click();
      expect(spy).toHaveBeenCalled();
    });
  });
});
