import { IsAdminPipe } from './is-admin.pipe';

describe('IsAdminPipe', () => {
  it('create an instance', () => {
    const pipe = new IsAdminPipe();
    expect(pipe).toBeTruthy();
  });
});
