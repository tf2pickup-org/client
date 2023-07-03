import { TestBed } from '@angular/core/testing';

import { ServemeTfConfigurationResolver } from './serveme-tf-configuration.resolver';

describe('ServemeTfConfigurationResolver', () => {
  let resolver: ServemeTfConfigurationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ServemeTfConfigurationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
