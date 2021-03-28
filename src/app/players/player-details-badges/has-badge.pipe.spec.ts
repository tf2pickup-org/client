import { HasBadgePipe } from './has-badge.pipe';

describe('HasBadgePipe', () => {
  it('create an instance', () => {
    const pipe = new HasBadgePipe();
    expect(pipe).toBeTruthy();
  });
});
