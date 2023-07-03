import { TestBed } from '@angular/core/testing';

import { ServemeTfConfigurationResolver } from './serveme-tf-configuration.resolver';
import { MockProvider } from 'ng-mocks';
import { ConfigurationService } from '@app/configuration/configuration.service';

describe('ServemeTfConfigurationResolver', () => {
  let resolver: ServemeTfConfigurationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(ConfigurationService)],
    });
    resolver = TestBed.inject(ServemeTfConfigurationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
