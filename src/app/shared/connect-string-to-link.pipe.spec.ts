import { ConnectStringToLinkPipe } from './connect-string-to-link.pipe';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';
import { TestBed, inject } from '@angular/core/testing';

class DomSanitizerStub {
  bypassSecurityTrustUrl(input: string) { return input; }
}

describe('ConnectStringToLinkPipe', () => {
  let pipe: ConnectStringToLinkPipe;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ BrowserModule ],
    providers: [
      { provide: DomSanitizer, useClass: DomSanitizerStub },
    ]
  }));

  beforeEach(inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    pipe = new ConnectStringToLinkPipe(domSanitizer);
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('creates a correct connect link', () => {
    expect(pipe.transform('connect localhost:27015; password foo')).toBe('steam://connect/localhost:27015/foo');
    expect(pipe.transform('connect localhost;password foo')).toBe('steam://connect/localhost/foo');
    expect(pipe.transform('connect localhost')).toBe('steam://connect/localhost');
    expect(pipe.transform('connect localhost:1234')).toBe('steam://connect/localhost:1234');
  });

  it('returns null when the connect string is invalid', () => {
    expect(pipe.transform('SOME_BULLSHIT')).toBeNull();
  });
});
