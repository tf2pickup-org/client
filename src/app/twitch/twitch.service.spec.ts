import { TestBed } from '@angular/core/testing';
import { TwitchService } from './twitch.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { API_URL } from '@app/api-url';
import { provideMockStore } from '@ngrx/store/testing';

describe('TwitchService', () => {
  let service: TwitchService;
  let httpContoller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: API_URL, useValue: 'FAKE_URL' },
        provideMockStore(),
      ],
    });

    service = TestBed.inject(TwitchService);
    httpContoller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpContoller.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchStreams()', () => {
    it('should call the endpoint', () => {
      service.fetchStreams().subscribe();
      httpContoller.expectOne('FAKE_URL/twitch/streams');
      expect().nothing();
    });
  });
});
