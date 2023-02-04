import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MapVoteButtonComponent } from './map-vote-button.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { MapThumbnailComponent } from '@app/shared/map-thumbnail/map-thumbnail.component';

describe('MapVoteButtonComponent', () => {
  let component: MapVoteButtonComponent;
  let fixture: ComponentFixture<MapVoteButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapVoteButtonComponent,
        MockComponent(MapThumbnailComponent),
      ],
      imports: [NoopAnimationsModule],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(MapVoteButtonComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapVoteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a map', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      component.map = 'cp_fake_rc1';
      fixture.detectChanges();

      button = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLButtonElement;
    });

    it('should render the button', () => {
      expect(button).toBeTruthy();
    });

    it('should render map thumbnail', () => {
      const mapThumbnailComponent = fixture.debugElement.query(
        By.directive(MapThumbnailComponent),
      ).componentInstance as MapThumbnailComponent;
      expect(mapThumbnailComponent.map).toEqual('cp_fake_rc1');
    });

    it('should render the map name', () => {
      const span = fixture.debugElement.query(
        By.css('.thumbnail__overlay__name > span'),
      ).nativeElement as HTMLSpanElement;
      expect(span.innerText).toEqual('cp_fake_rc1');
    });

    describe('with results', () => {
      beforeEach(() => {
        component.votePercent = 0.75;
        fixture.detectChanges();
      });

      it('should render results', () => {
        const span = fixture.debugElement.query(
          By.css('.thumbnail__overlay__vote-result > div'),
        ).nativeElement as HTMLSpanElement;
        expect(span.innerText).toEqual('75%');
      });
    });

    describe('when not selected', () => {
      beforeEach(() => {
        component.selected = false;
        fixture.detectChanges();
      });

      it('should not apply the is-selected css class', () => {
        expect(button.classList.contains('is-selected')).toBe(false);
      });
    });

    it('should render content-fill', () => {
      expect(
        fixture.debugElement.query(By.css('.thumbnail__overlay__fill')),
      ).toBeTruthy();
    });

    describe('when selected', () => {
      beforeEach(() => {
        component.selected = true;
        fixture.detectChanges();
      });

      it('should apply the is-selected css class', () => {
        expect(button.classList.contains('is-selected')).toBe(true);
      });
    });

    describe('when enabled', () => {
      beforeEach(() => {
        component.disabled = false;
        fixture.detectChanges();
      });

      describe('when clicked', () => {
        it('should emit voteToggle', done => {
          component.voteToggle.subscribe(isSelected => {
            expect(isSelected).toBe(true);
            done();
          });

          button.click();
        });
      });
    });
  });
});
