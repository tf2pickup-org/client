import { WithLoadingPipe } from './with-loading.pipe';

describe('WithLoadingPipe', () => {
  it('create an instance', () => {
    const pipe = new WithLoadingPipe();
    expect(pipe).toBeTruthy();
  });
});
