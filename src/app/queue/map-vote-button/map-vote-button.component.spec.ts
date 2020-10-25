import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MapVoteButtonComponent } from './map-vote-button.component';
import { MapThumbnailService } from '../../shared/map-thumbnail.service';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

class MapThumbnailServiceStub {
  getMapThumbnailPath(map: string) { return map + '.png'; }
}

describe('MapVoteButtonComponent', () => {
  let component: MapVoteButtonComponent;
  let fixture: ComponentFixture<MapVoteButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapVoteButtonComponent ],
      providers: [
        { provide: MapThumbnailService, useClass: MapThumbnailServiceStub },
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(MapVoteButtonComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
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
    beforeEach(() => {
      component.map = 'cp_fake_rc1';
      fixture.detectChanges();
    });

    it('should set proper background-image', () => {
      const div = fixture.debugElement.query(By.css('.map-thumbnail')).nativeElement as HTMLDivElement;
      expect(div.style.backgroundImage).toMatch(/url\(['"]cp_fake_rc1\.png["']\)/);
    });

    it('should render the map name', () => {
      const span = fixture.debugElement.query(By.css('.map-name > span')).nativeElement as HTMLSpanElement;
      expect(span.innerText).toEqual('cp_fake_rc1');
    });

    describe('with results', () => {
      beforeEach(() => {
        component.votePercent = 0.75;
        fixture.detectChanges();
      });

      it('should render results', () => {
        const span = fixture.debugElement.query(By.css('.map-vote-result > span')).nativeElement as HTMLSpanElement;
        expect(span.innerText).toEqual('75%');
      });
    });

    describe('when not selected', () => {
      beforeEach(() => {
        component.selected = false;
        fixture.detectChanges();
      });

      it('should not apply the is-selected css class', () => {
        const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
        expect(button.classList.contains('is-selected')).toBe(false);
      });
    });

    it('should render content-fill', () => {
      expect(fixture.debugElement.query(By.css('.content.fill'))).toBeTruthy();
    });

    describe('when selected', () => {
      beforeEach(() => {
        component.selected = true;
        fixture.detectChanges();
      });

      it('should apply the is-selected css class', () => {
        const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
        expect(button.classList.contains('is-selected')).toBe(true);
      });
    });
  });
});
