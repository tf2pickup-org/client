import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MapVoteButtonComponent } from './map-vote-button.component';
import { MapThumbnailService } from '../map-thumbnail.service';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

class MapThumbnailServiceStub {
  getMapThumbnailPath(map: string) { return 'fake_thumbnail.png'; }
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

  it('should apply correct css classes', () => {
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.classList.contains('active')).toBe(false);

    component.active = true;
    fixture.detectChanges();
    expect(btn.classList.contains('active')).toBe(true);
  });

  it('should apply the disabled attribute', () => {
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBe(true);

    component.disabled = false;
    fixture.detectChanges();
    expect(btn.disabled).toBe(false);
  });

  it('should apply the correct thumbnail path', () => {
    const spy = spyOn(TestBed.get(MapThumbnailService), 'getMapThumbnailPath').and.callThrough();
    component.map = 'FAKE_MAP';
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('FAKE_MAP');

    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn.style.backgroundImage).toEqual('url("fake_thumbnail.png")');
  });

  describe('#toggleVote()', () => {
    it('should emit the voteToggle event', () => {
      component.active = false;
      component.voteToggle.subscribe(value => expect(value).toBe(true));
      component.toggleVote();
    });
  });
});
