import { TestBed, inject } from '@angular/core/testing';
import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapThumbnailService = TestBed.inject(MapThumbnailService);
    expect(service).toBeTruthy();
  });

  describe('#getMapThumbnailUrl()', () => {
    it('should return full file path', inject(
      [MapThumbnailService],
      (service: MapThumbnailService) => {
        expect(service.getMapThumbnailUrl('cp_fake_rc1')).toEqual(
          '/map-thumbnails/unsafe/300x169/cp_fake.jpg',
        );
      },
    ));
  });
});
