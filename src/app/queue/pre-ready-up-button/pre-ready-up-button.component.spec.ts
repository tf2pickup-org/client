import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PreReadyUpButtonComponent } from './pre-ready-up-button.component';
import { SecondsPipe } from '../seconds.pipe';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { isPreReadied } from '../queue.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { togglePreReady } from '../queue.actions';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { FeatherComponent } from 'angular-feather';
import { MockComponent } from 'ng-mocks';

describe('PreReadyUpButtonComponent', () => {
  let component: PreReadyUpButtonComponent;
  let fixture: ComponentFixture<PreReadyUpButtonComponent>;
  let store: MockStore;
  let isPreReadiedSelector: MemoizedSelector<any, boolean>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreReadyUpButtonComponent,
        SecondsPipe,
        MockComponent(FeatherComponent),
      ],
      providers: [provideMockStore()],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(PreReadyUpButtonComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    isPreReadiedSelector = store.overrideSelector(isPreReadied, false);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PreReadyUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch togglePreReady action', () => {
    const button = fixture.debugElement.query(By.css('button.pre-ready-up-btn'))
      .nativeElement as HTMLButtonElement;
    button.click();
    expect(store.dispatch).toHaveBeenCalledWith(togglePreReady());
  });

  describe('when pre-readied', () => {
    beforeEach(() => {
      isPreReadiedSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should apply the active class', () => {
      const button = fixture.debugElement.query(
        By.css('button.pre-ready-up-btn'),
      ).nativeElement as HTMLButtonElement;
      expect(button.classList.contains('active')).toBe(true);
    });
  });
});
