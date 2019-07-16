import { TestBed } from '@angular/core/testing';

import { GameServersService } from './game-servers.service';

describe('GameServersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameServersService = TestBed.get(GameServersService);
    expect(service).toBeTruthy();
  });
});
