import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreReadyUpButtonComponent } from './pre-ready-up-button.component';
import { SecondsPipe } from '../seconds.pipe';
import { provideMockStore } from '@ngrx/store/testing';
import { isInQueue, isPreReadied } from '../queue.selectors';
import { Store } from '@ngrx/store';
import { togglePreReady } from '../queue.actions';
import { By } from '@angular/platform-browser';

describe('PreReadyUpButtonComponent', () => {
  let component: PreReadyUpButtonComponent;
  let fixture: ComponentFixture<PreReadyUpButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreReadyUpButtonComponent,
        SecondsPipe,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: isInQueue, value: false },
            { selector: isPreReadied, value: false },
          ]
        }),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreReadyUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#preReadyToggle()', () => {
    it('should dispatch togglePreReady action', () => {
      const store = TestBed.get(Store);
      const spy = spyOn(store, 'dispatch');

      component.preReadyToggle();
      expect(spy).toHaveBeenCalledWith(togglePreReady());
    });
  });

  it('should be disabled unless in queue', () => {
    const btn = fixture.debugElement.query(By.css('button.pre-ready-up-btn')).nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('should apply the btn-primary class unless pre-ready is on', () => {
    const btn = fixture.debugElement.query(By.css('button.pre-ready-up-btn')).nativeElement as HTMLButtonElement;
    expect(btn.classList.contains('btn-primary')).toBe(true);
  });
});
