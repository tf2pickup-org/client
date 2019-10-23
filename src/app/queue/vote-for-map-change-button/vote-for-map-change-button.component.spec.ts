import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteForMapChangeButtonComponent } from './vote-for-map-change-button.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { MemoizedSelector, Store } from '@ngrx/store';
import { isInQueue, mapChangeVoterCount, queueConfig, votesForMapChange } from '../queue.selectors';
import { By } from '@angular/platform-browser';

describe('VoteForMapChangeButtonComponent', () => {
  let component: VoteForMapChangeButtonComponent;
  let fixture: ComponentFixture<VoteForMapChangeButtonComponent>;
  let store: MockStore<any>;
  let fakeIsInQueue: MemoizedSelector<AppState, boolean>;
  let theButton: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteForMapChangeButtonComponent ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: mapChangeVoterCount, value: 2 },
            { selector: queueConfig, value: { nextMapSuccessfulVoteThreshold: 12 } },
            { selector: votesForMapChange, value: false },
          ]
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fakeIsInQueue = store.overrideSelector(isInQueue, false);

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

    it('should enable the button if he is', () => {
      fakeIsInQueue.setResult(true);
      store.refreshState();
      fixture.detectChanges();
      expect(theButton.disabled).toBe(false);
    });
  });
});
