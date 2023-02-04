import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { MapThumbnailService } from '../map-thumbnail.service';
import { MapThumbnailComponent } from './map-thumbnail.component';

describe('MapThumbnailComponent', () => {
  let component: MapThumbnailComponent;
  let fixture: MockedComponentFixture<MapThumbnailComponent>;

  beforeEach(() =>
    MockBuilder(MapThumbnailComponent).mock(MapThumbnailService, {
      getMapThumbnailUrl: jasmine
        .createSpy('getMapThumbnailUrl')
        .and.callFake(mapName => `${mapName}.jpg`),
    }),
  );

  beforeEach(() => {
    fixture = MockRender(MapThumbnailComponent, { map: 'cp_badlands' } as any);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve correct img src', () => {
    const img = ngMocks.find('img').nativeElement as HTMLImageElement;
    expect(img.src).toMatch(/cp_badlands.jpg$/);
  });
});
