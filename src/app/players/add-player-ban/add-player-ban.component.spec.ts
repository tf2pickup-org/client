import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddPlayerBanComponent } from './add-player-ban.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Location } from '@angular/common';
import { Router, convertToParamMap, ActivatedRoute } from '@angular/router';
import { playerBanAdded } from '../actions';
import { PlayerBan } from '../models/player-ban';
import { By } from '@angular/platform-browser';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

describe('AddPlayerBanComponent', () => {
  let component: AddPlayerBanComponent;
  let fixture: ComponentFixture<AddPlayerBanComponent>;
  let store: MockStore;
  let submit: HTMLButtonElement;
  let actions: Subject<Action>;

  const initialState = {
    profile: {
      authenticated: 'authenticated',
      player: {
        id: 'FAKE_ADMIN_ID',
      },
    },
    players: {
      bans: {
        locked: false,
      },
      players: {
        ids: ['FAKE_ID'],
        entities: {
          FAKE_ID: {
            id: 'FAKE_ID',
            name: 'FAKE_NAME',
          },
        },
      },
    },
  };

  beforeEach(() => {
    actions = new Subject<Action>();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlayerBanComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: Actions, useValue: actions },
        { provide: ActivatedRoute, useValue: { paramMap } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AddPlayerBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    submit = fixture.debugElement.query(
      By.css('button[type=submit]'),
    ).nativeElement;
  });

  afterEach(() => actions.complete());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button', () => {
    expect(submit.disabled).toBe(true);
  });

  it('should redirect to player ban list when adding a ban is done', () => {
    const spy = spyOn(TestBed.inject(Router), 'navigate');
    actions.next(
      playerBanAdded({ playerBan: { player: 'FAKE_ID' } } as {
        playerBan: PlayerBan;
      }),
    );
    expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID', 'bans']);
  });

  describe('when valid', () => {
    beforeEach(() => {
      const reasonDiv = fixture.debugElement.query(By.css('input.reason-input'))
        .nativeElement as HTMLInputElement;
      reasonDiv.value = 'FAKE_REASON';
      reasonDiv.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    });

    it('should enable the submit button', () => {
      expect(submit.disabled).toBe(false);
    });
  });

  describe('#cancel()', () => {
    it('should call location.back()', () => {
      const spy = spyOn(TestBed.inject(Location), 'back');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });
  });
});
