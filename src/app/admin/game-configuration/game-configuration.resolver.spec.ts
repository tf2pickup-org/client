import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MockProvider } from 'ng-mocks';
import { GameConfigurationResolver } from './game-configuration.resolver';

describe('GameConfigurationResolver', () => {
  let resolver: GameConfigurationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(ConfigurationService)],
    });
    resolver = TestBed.inject(GameConfigurationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
