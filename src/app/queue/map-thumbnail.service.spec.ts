import { TestBed, inject } from '@angular/core/testing';
import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapThumbnailService = TestBed.get(MapThumbnailService);
    expect(service).toBeTruthy();
  });

  describe('#getMapThumbnail()', () => {
    it('should return valid thumbnails', inject([MapThumbnailService], (service: MapThumbnailService) => {
      [
        'cp_badlands',
        'cp_prolands_rc2t',
        'cp_granary',
        'cp_granary_pro_rc8',
        'cp_gullywash_final1',
        'cp_process_final',
        'cp_reckoner_rc2',
        'cp_snakewater_final1',
        'cp_sunshine',
      ].forEach(map => {
        expect(map).toBeTruthy();
        expect(map === 'unknown').toBe(false);
      });
    }));

    it('should return unknown.png for unknown map', inject([MapThumbnailService], (service: MapThumbnailService) => {
      expect(service.getMapThumbnail('some fake map')).toEqual('unknown');
    }));
  });

  describe('#getMapThumbnailPath()', () => {
    it('should return full file path', inject([MapThumbnailService], (service: MapThumbnailService) => {
      expect(service.getMapThumbnailPath('fake map')).toMatch(/^\/assets\/.+\.png$/);
    }));
  });
});
