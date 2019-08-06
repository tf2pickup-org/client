import { SafeMumbleUrlPipe } from './safe-mumble-url.pipe';
import { TestBed, inject } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

class DomSanitizerStub {
  bypassSecurityTrustUrl(input: string) { return input; }
}

describe('SafeMumbleUrlPipe', () => {
  let pipe: SafeMumbleUrlPipe;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ BrowserModule ],
    providers: [
      { provide: DomSanitizer, useClass: DomSanitizerStub },
    ]
  }));

  beforeEach(inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    pipe = new SafeMumbleUrlPipe(domSanitizer);
  }));

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should bypass security url check', () => {
    const spy = spyOn(TestBed.get(DomSanitizer), 'bypassSecurityTrustUrl');
    pipe.transform('mumble://FAKE_URL');
    expect(spy).toHaveBeenCalledWith('mumble://FAKE_URL');
  });

  it('should deny protocols other than mumble:', () => {
    const spy = spyOn(TestBed.get(DomSanitizer), 'bypassSecurityTrustUrl');
    pipe.transform('fakeprotocol://FAKE_URL');
    expect(spy).not.toHaveBeenCalled();
  });
});
