import { TestBed } from '@angular/core/testing';

import { DiscordConfigurationResolver } from './discord-configuration.resolver';

describe('DiscordConfigurationResolver', () => {
  let resolver: DiscordConfigurationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DiscordConfigurationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
