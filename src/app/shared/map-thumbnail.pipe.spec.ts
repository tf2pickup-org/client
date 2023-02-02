import { first, of } from 'rxjs';
import { MapThumbnailPipe } from './map-thumbnail.pipe';
import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailPipe', () => {
  let pipe: MapThumbnailPipe;
  let mapThumbnailService: jasmine.SpyObj<MapThumbnailService>;

  beforeEach(() => {
    mapThumbnailService = jasmine.createSpyObj<MapThumbnailService>([
      'getMapThumbnail',
    ]);
    mapThumbnailService.getMapThumbnail.and.returnValue(
      of('FAKE_THUMBNAIL_URL'),
    );
    pipe = new MapThumbnailPipe(mapThumbnailService);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform()', () => {
    it('should return the thumbnail', () => {
      pipe
        .transform('FAKE_MAP')
        .pipe(first())
        .subscribe(value => expect(value).toEqual('FAKE_THUMBNAIL_URL'));
    });
  });
});
