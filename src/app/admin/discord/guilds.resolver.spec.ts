import { TestBed } from '@angular/core/testing';

import { GuildsResolver } from './guilds.resolver';

describe('GuildsResolver', () => {
  let resolver: GuildsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GuildsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
