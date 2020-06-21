import { MapThumbnailPipe } from './map-thumbnail.pipe';
import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailPipe', () => {
  let pipe: MapThumbnailPipe;
  let mapThumbnailService: jasmine.SpyObj<MapThumbnailService>;

  beforeEach(() => {
    mapThumbnailService = jasmine.createSpyObj<MapThumbnailService>([ 'getMapThumbnailPath' ]);
    mapThumbnailService.getMapThumbnailPath.and.returnValue('FAKE_THUMBNAIL_PATH');
    pipe = new MapThumbnailPipe(mapThumbnailService);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform()', () => {
    it('should return the thumbnail path', () => {
      expect(pipe.transform('FAKE_MAP')).toEqual('FAKE_THUMBNAIL_PATH');
    });
  });
});
