import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MockProvider } from 'ng-mocks';
import { filter, map, Subject, take } from 'rxjs';
import { PlayerRestrictionsResolver } from './player-restrictions.resolver';

describe('PlayerRestrictionsResolver', () => {
  let resolver: PlayerRestrictionsResolver;
  let configuration: Subject<Record<string, any>>;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ConfigurationService, {
          fetchValues: jasmine.createSpy('fetchValue').and.callFake((...keys) =>
            configuration.pipe(
              filter(configuration => keys.every(key => key in configuration)),
              map(configuration =>
                keys.map(key => ({
                  value: configuration[key],
                })),
              ),
              take(1),
            ),
          ),
          storeValues: jasmine
            .createSpy('storeValue')
            .and.callFake((...entries) =>
              configuration.pipe(
                filter(configuration =>
                  entries.every(entry => entry.key in configuration),
                ),
                map(configuration =>
                  entries.map(entry => configuration[entry.key]),
                ),
                take(1),
              ),
            ),
        }),
      ],
    });
    resolver = TestBed.inject(PlayerRestrictionsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('#resolve()', () => {
    it('should fetch configuration', done => {
      resolver.resolve().subscribe(configuration => {
        expect(configuration).toEqual({
          etf2lAccountRequired: true,
          minimumTf2InGameHours: 450,
          denyPlayersWithNoSkillAssigned: false,
        });
        done();
      });

      configuration.next({
        'players.etf2l_account_required': true,
        'players.minimum_in_game_hours': 450,
        'queue.deny_players_with_no_skill_assigned': false,
      });
    });
  });
});
