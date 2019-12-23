import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlayerBanComponent } from './add-player-ban.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Location } from '@angular/common';
import { Router, convertToParamMap, ActivatedRoute } from '@angular/router';
import { playerBanAdded, addPlayerBan } from '../actions';
import { PlayerBan } from '../models/player-ban';
import { By } from '@angular/platform-browser';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));
const actions = new Subject<Action>();

describe('AddPlayerBanComponent', () => {
  let component: AddPlayerBanComponent;
  let fixture: ComponentFixture<AddPlayerBanComponent>;

  const initialState = {
    profile: {
      profile: {
        id: 'FAKE_ADMIN_ID',
      }
    },
    players: {
      bans: {
        locked: false,
      },
      players: {
        ids: [ 'FAKE_ID' ],
        entities: {
          FAKE_ID: {
            id: 'FAKE_ID',
            name: 'FAKE_NAME',
          },
        },
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayerBanComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Actions, useValue: actions },
        { provide: ActivatedRoute, useValue: { paramMap } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayerBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to player ban list when adding a ban is done', () => {
    const spy = spyOn(TestBed.get(Router), 'navigate');
    actions.next(playerBanAdded({ playerBan: { player: 'FAKE_ID' } } as { playerBan: PlayerBan }));
    expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID', 'bans']);
  });

  describe('#submit()', () => {
    it('should dispatch action', () => {
      const reasonDiv = fixture.debugElement.query(By.css('input#reason')).nativeElement as HTMLInputElement;
      reasonDiv.value = 'FAKE_REASON';
      reasonDiv.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const spy = spyOn(TestBed.get(Store), 'dispatch').and.callThrough();
      component.submit();
      expect(spy).toHaveBeenCalledWith(addPlayerBan({ playerBan: {
        player: 'FAKE_ID',
        start: jasmine.any(Date) as any,
        end: jasmine.any(Date) as any,
        reason: 'FAKE_REASON',
        admin: 'FAKE_ADMIN_ID',
      }}));
    });
  });

  describe('#cancel()', () => {
    it('should call location.back()', () => {
      const spy = spyOn(TestBed.get(Location), 'back');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });
  });
});
