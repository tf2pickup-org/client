import { TestBed } from '@angular/core/testing';

import { DiscordService } from './discord.service';

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
