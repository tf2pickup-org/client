import { TestBed } from '@angular/core/testing';

import { GameServerResolver } from './game-server.resolver';

describe('GameServerResolver', () => {
  let resolver: GameServerResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GameServerResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
