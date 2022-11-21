import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MapVoteComponent } from './map-vote.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppState } from '@app/app.state';
import { Store } from '@ngrx/store';
import { mapVoteTotalCount, mapVote, isInQueue } from '../queue.selectors';
import { voteForMap } from '../queue.actions';

describe('MapVoteComponent', () => {
  let component: MapVoteComponent;
  let fixture: ComponentFixture<MapVoteComponent>;
  let store: MockStore<AppState>;

  const initialState = {
    queue: {
      mapVoteResults: [
        {
          map: 'cp_process_final',
          voteCount: 1,
        },
        {
          map: 'cp_reckoner_rc2',
          voteCount: 1,
        },
        {
          map: 'cp_snakewater_final1',
          voteCount: 0,
        },
      ],
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MapVoteComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: mapVote, value: null },
            { selector: isInQueue, value: false },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(MapVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('results', () => {
    it('should be calculated correctly when total=0', () => {
      store.overrideSelector(mapVoteTotalCount, 0);
      component.results.subscribe(results => {
        expect(results.length).toBe(3);
        expect(results.every(r => r.votePercent === 0)).toBe(true);
      });
    });

    it('should be correct for other values', () => {
      component.results.subscribe(results => {
        expect(results).toEqual([
          {
            map: 'cp_process_final',
            voteCount: 1,
            votePercent: 0.5,
          },
          {
            map: 'cp_reckoner_rc2',
            voteCount: 1,
            votePercent: 0.5,
          },
          {
            map: 'cp_snakewater_final1',
            voteCount: 0,
            votePercent: 0,
          },
        ]);
      });
    });
  });

  describe('#voteForMap()', () => {
    it('should dispatch action', () => {
      const spy = spyOn(store, 'dispatch');
      component.voteForMap('cp_fake');
      expect(spy).toHaveBeenCalledWith(voteForMap({ map: 'cp_fake' }));
    });
  });
});
