import { TestBed } from '@angular/core/testing';

import { StaticGameServerResolver } from './static-game-server.resolver';

describe('StaticGameServerResolver', () => {
  let resolver: StaticGameServerResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StaticGameServerResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
