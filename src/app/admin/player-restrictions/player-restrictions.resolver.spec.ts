import { TestBed } from '@angular/core/testing';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { DenyPlayersWithNoSkillAssigned } from '@app/configuration/models/deny-players-with-no-skill-assigned';
import { Etf2lAccountRequired } from '@app/configuration/models/etf2l-account-required';
import { MinimumTf2InGameHours } from '@app/configuration/models/minimum-tf2-in-game-hours';
import { MockProvider } from 'ng-mocks';
import { Subject, take } from 'rxjs';
import { PlayerRestrictionsResolver } from './player-restrictions.resolver';

describe('PlayerRestrictionsResolver', () => {
  let resolver: PlayerRestrictionsResolver;
  let etf2lAccountRequired: Subject<Etf2lAccountRequired>;
  let minimumTf2InGameHours: Subject<MinimumTf2InGameHours>;
  let denyPlayersWithNoSkillAssigned: Subject<DenyPlayersWithNoSkillAssigned>;

  beforeEach(() => {
    etf2lAccountRequired = new Subject();
    minimumTf2InGameHours = new Subject();
    denyPlayersWithNoSkillAssigned = new Subject();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ConfigurationService, {
          fetchValue: jasmine.createSpy('fetchValue').and.callFake(
            key =>
              ({
                [ConfigurationEntryKey.etf2lAccountRequired]:
                  etf2lAccountRequired.pipe(take(1)),
                [ConfigurationEntryKey.minimumTf2InGameHours]:
                  minimumTf2InGameHours.pipe(take(1)),
                [ConfigurationEntryKey.denyPlayersWithNoSkillAssigned]:
                  denyPlayersWithNoSkillAssigned.pipe(take(1)),
              }[key]),
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

      etf2lAccountRequired.next({
        key: ConfigurationEntryKey.etf2lAccountRequired,
        value: true,
      });
      minimumTf2InGameHours.next({
        key: ConfigurationEntryKey.minimumTf2InGameHours,
        value: 450,
      });
      denyPlayersWithNoSkillAssigned.next({
        key: ConfigurationEntryKey.denyPlayersWithNoSkillAssigned,
        value: false,
      });
    });
  });
});
