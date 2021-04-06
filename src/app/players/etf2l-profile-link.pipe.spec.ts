import { Etf2lProfileLinkPipe } from './etf2l-profile-link.pipe';

describe('Etf2lProfileLinkPipe', () => {
  let pipe: Etf2lProfileLinkPipe;

  beforeEach(() => (pipe = new Etf2lProfileLinkPipe()));

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should create a correct ETF2L profile link', () => {
    expect(pipe.transform('123456')).toEqual(
      'http://etf2l.org/forum/user/123456',
    );
  });
});
