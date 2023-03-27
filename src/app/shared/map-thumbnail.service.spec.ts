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
      'bball_tf_v2',
      'ctf_ballin_comptf',
      'ctf_ballin_sky',
      'ctf_bball_eu_fix',
      'ctf_bball_sweethills_v1',
      'koth_proplant_v3',
      'koth_cascade_v2_b6',
      'koth_ramjam_b9',
      'ultiduo_badlands_b1',
      'ultiduo_baloo_v2',
      'ultiduo_canal_rc3a2',
      'ultiduo_grove_b4',
      'ultiduo_gullywash_b2',
      'ultiduo_lookout_b1',
      'koth_ultiduo_r_b7',
      'ultiduo_seclusion_b3',
      'cp_steel_f12',
      'koth_proot_b4b',
      'pl_problitz_rc2',
      'pl_divulgence_b4b',
      'cp_caldera_rc1',
      'pl_cornwater_b8b',
      'cp_croissant_final',
      'pl_eruption_b10_test2',
      'koth_daenam_b11',
      'koth_empire_b4',
      'koth_proside_v1',
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
