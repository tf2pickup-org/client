/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerEditComponent } from './player-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { loadPlayerSkill, playerEdited, loadPlayer, setPlayerName, setPlayerSkill } from '../actions';
import { Location } from '@angular/common';
import { By, Title } from '@angular/platform-browser';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));
const actions = new Subject<Action>();

describe('PlayerEditComponent', () => {
  let component: PlayerEditComponent;
  let fixture: ComponentFixture<PlayerEditComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;
  let setTitleSpy: jasmine.Spy;

  const initialState = {
    players: {
      players: {
        ids: [],
        entities: { },
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerEditComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap } },
        provideMockStore({ initialState }),
        { provide: Actions, useValue: actions },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');
    setTitleSpy = spyOn(TestBed.get(Title), 'setTitle').and.callThrough();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load player skill', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayerSkill({ playerId: 'FAKE_ID' }));
  });

  it('should load player data', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_ID' }));
  });

  describe('#cancel()', () => {
    it('should navigate back to the player details page', () => {
      const spy = spyOn(TestBed.get(Location), 'back');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#onKeyDown()', () => {
    it('should navigate back to the player details page', () => {
      const spy = spyOn(TestBed.get(Location), 'back');
      component.onKeyDown();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('with player', () => {
    let saveButton: HTMLButtonElement;

    beforeEach(() => {
      store.setState({
        players: {
          players: {
            ids: [
              'FAKE_ID'
            ],
            entities: {
              FAKE_ID: {
                name: 'maly',
                id: 'FAKE_ID',
              }
            },
            locked: false
          },
        },
      });

      saveButton = fixture.debugElement.query(By.css('.save-button')).nativeElement as HTMLButtonElement;
    });

    it('should set the title', () => {
      expect(setTitleSpy).toHaveBeenCalledWith(jasmine.stringMatching('maly'));
    });

    it('should set the player name', () => {
      expect(component.player.value.name).toEqual('maly');
    });

    it('should have the save button disabled initially', () => {
      expect(saveButton.disabled).toBe(true);
    });

    describe('when edited', () => {
      let playerNameInput: HTMLInputElement;

      beforeEach(() => {
        playerNameInput = fixture.debugElement.query(By.css('.name-field input[type=text]')).nativeElement as HTMLInputElement;

        playerNameInput.value = 'maly2';
        playerNameInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('should enable the save button', () => {
        expect(saveButton.disabled).toBe(false);
      });

      it('should dispatch the setPlayerName action', () => {
        saveButton.click();
        expect(storeDispatchSpy).toHaveBeenCalledWith(setPlayerName({ playerId: 'FAKE_ID', name: 'maly2' }));
      });

      it('should redirect to the player details after saving is done', () => {
        const spy = spyOn(TestBed.inject(Router), 'navigate');

        saveButton.click();

        actions.next(playerEdited({ player: { id: 'FAKE_ID' } } as any));
        expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID']);
      });
    });

    describe('and with skill', () => {
      describe('when saved', () => {
        it('should dispatch the setPlayerSkill action', () => {
          component.player.value.skill = { demoman: -1 };
          saveButton.disabled = false; // I'm feeling bad about this, but it needs to be called explicitly
          saveButton.click();
          expect(storeDispatchSpy).toHaveBeenCalledWith(setPlayerSkill({ playerId: 'FAKE_ID', skill: { demoman: -1 }}));
        });
      });
    });
  });
});
