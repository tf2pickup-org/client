import { LogsTfProfileLinkPipe } from './logs-tf-profile-link.pipe';

describe('LogsTfProfileLinkPipe', () => {
  let pipe: LogsTfProfileLinkPipe;

  beforeEach(() => (pipe = new LogsTfProfileLinkPipe()));

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should create correct logs.tf profile link', () => {
    expect(pipe.transform('FAKE_STEAM_ID')).toEqual(
      'https://logs.tf/profile/FAKE_STEAM_ID',
    );
  });
});
