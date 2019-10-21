import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VoteForMapChangeButtonComponent } from './vote-for-map-change-button.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { MemoizedSelector, Store } from '@ngrx/store';
import { isInQueue, votesForMapChange, mapChangeVoterCount, queueConfig } from '../queue.selectors';
import { By } from '@angular/platform-browser';

describe('VoteForMapChangeButtonComponent', () => {
  let component: VoteForMapChangeButtonComponent;
  let fixture: ComponentFixture<VoteForMapChangeButtonComponent>;
  let store: MockStore<any>;
  let fakeIsInQueue: MemoizedSelector<AppState, boolean>;
  let fakeVotesForMapChange: MemoizedSelector<AppState, boolean>;
  let theButton: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteForMapChangeButtonComponent ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapChangeVoterCount, value: 2 },
            { selector: queueConfig, value: { nextMapSuccessfulVoteThreshold: 12 } },
          ]
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fakeIsInQueue = store.overrideSelector(isInQueue, false);
    fakeVotesForMapChange = store.overrideSelector(votesForMapChange, false);

    fixture = TestBed.createComponent(VoteForMapChangeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    theButton = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('depending on whether the user is added to the queue', () => {
    it('should disable the button if he isn\'t', () => {
      expect(theButton.disabled).toBe(true);
    });

    xit('should enable the button if he is', () => {
      // this should be working, but setResult() doesn't work as it should
      // https://github.com/ngrx/platform/issues/2000
      fakeIsInQueue.setResult(true);
      store.setState({ });
      fixture.detectChanges();
      expect(theButton.disabled).toBe(false);
    });
  });
});
