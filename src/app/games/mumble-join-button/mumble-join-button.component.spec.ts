import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MumbleJoinButtonComponent } from './mumble-join-button.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SharedModule } from '@app/shared/shared.module';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

describe('MumbleJoinButtonComponent', () => {
  let component: MumbleJoinButtonComponent;
  let fixture: ComponentFixture<MumbleJoinButtonComponent>;
  let store: MockStore<any>;

  const initialState = {
    games: {
      ids: [ 'FAKE_GAME_ID' ],
      entities: {
        FAKE_GAME_ID: {
          slots: [
            {
              playerId: 'FAKE_PLAYER_ID',
              teamId: 1,
            },
          ],
          teams: {
            0: 'BLU',
            1: 'RED',
          },
          mumbleUrl: 'mumble://melkor.tf/tf2pickup/5',
        }
      },
    },
    profile: {
      profile: {
        id: 'FAKE_PLAYER_ID',
        name: 'FAKE_PLAYER_NAME',
      }
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MumbleJoinButtonComponent ],
      imports: [
        SharedModule,
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
    })
    .overrideComponent(MumbleJoinButtonComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(MumbleJoinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('mumble url', () => {
    it('should be created properly', () => {
      component.gameId = 'FAKE_GAME_ID';
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
      expect(el.href).toBe('mumble://FAKE_PLAYER_NAME@melkor.tf/tf2pickup/5/RED');
    });

    it('should be empty unless the user is authenticated', () => {
      store.setState({ ...initialState, profile: undefined });
      component.gameId = 'FAKE_GAME_ID';
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('a'))).toBeNull();
    });
  });
});
