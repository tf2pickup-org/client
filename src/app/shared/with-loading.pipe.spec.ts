import { Subject } from 'rxjs';
import { WithLoadingPipe } from './with-loading.pipe';

describe('WithLoadingPipe', () => {
  let pipe: WithLoadingPipe;

  beforeEach(() => {
    pipe = new WithLoadingPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should set loading: true initially', () => {
    const input = new Subject<number>();
    let output = null;
    pipe.transform(input).subscribe(v => (output = v));
    expect(output).toEqual({ loading: true });
    input.complete();
  });

  describe('when the value is loaded', () => {
    it('should set the given value', () => {
      const input = new Subject<number>();
      let output = null;
      pipe.transform(input).subscribe(v => (output = v));
      input.next(42);
      expect(output).toEqual({ loading: false, value: 42 });
      input.complete();
    });
  });

  describe('when an error occurs', () => {
    it('should set the error', () => {
      const input = new Subject<number>();
      let output = null;
      pipe.transform(input).subscribe(v => (output = v));
      input.error('FAKE_ERROR');
      expect(output).toEqual({ loading: false, error: 'FAKE_ERROR' });
      input.complete();
    });
  });
});
