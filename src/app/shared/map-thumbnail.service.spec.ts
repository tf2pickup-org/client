import { TestBed, inject } from '@angular/core/testing';
import { MapThumbnailService } from './map-thumbnail.service';

describe('MapThumbnailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapThumbnailService = TestBed.inject(MapThumbnailService);
    expect(service).toBeTruthy();
  });

  describe('#getMapThumbnail()', () => {
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
      'koth_product_rcx',
      'koth_warmtic_b6',
      'koth_coalplant_b8',
      'pl_prowater_b6',
      'cp_gullywash_final1',
      'pl_upward',
      'pl_borneo',
      'pl_swiftwater_final1',
      'pl_vigil_rc6',
      'cp_propaganda_b16',
      'pl_barnblitz_pro6',
      'koth_clearcut_b14',
      'cp_villa_b12',
      'koth_bagel_fall_b7',
      'cp_metalworks',
      'koth_lakeside_final',
      'pl_summercoast_rc8d',
      'cp_logjam_rc11',
      'koth_ashville_rc2c',
      'cp_mannbase_b18a',
      'cp_reckoner_rc6',
      'cp_villa_b18',
      'cp_kalinka_rc5',
      'cp_cardinal_rc1a',
    ].forEach(map =>
      it(`should return valid thumbnail for ${map}`, inject(
        [MapThumbnailService],
        (service: MapThumbnailService) => {
          const thumbnail = service.getMapThumbnail(map);
          expect(thumbnail).toBeTruthy();
          expect(thumbnail === 'unknown').toBe(false);
        },
      )),
    );

    it('should return unknown.png for unknown map', inject(
      [MapThumbnailService],
      (service: MapThumbnailService) => {
        expect(service.getMapThumbnail('some fake map')).toEqual('unknown');
      },
    ));
  });

  describe('#getMapThumbnailPath()', () => {
    it('should return full file path', inject(
      [MapThumbnailService],
      (service: MapThumbnailService) => {
        expect(service.getMapThumbnailPath('fake map')).toMatch(
          /^\/assets\/.+\.png$/,
        );
      },
    ));
  });
});
