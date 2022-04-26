import { CountryFlagPipe } from './country-flag.pipe';

describe(CountryFlagPipe.name, () => {
  it('create an instance', () => {
    const pipe = new CountryFlagPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a flag', () => {
    const pipe = new CountryFlagPipe();
    expect(pipe.transform('pl')).toEqual('🇵🇱');
  });
});
