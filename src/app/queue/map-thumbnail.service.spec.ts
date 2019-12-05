import { TestBed, inject } from '@angular/core/testing';
import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapThumbnailService = TestBed.get(MapThumbnailService);
    expect(service).toBeTruthy();
  });

  describe('#getMapThumbnail()', () => {
    it('should return unknown.png for unknown map', inject([MapThumbnailService], (service: MapThumbnailService) => {
      expect(service.getMapThumbnail('some fake map')).toEqual('unknown');
    }));
  });
});
