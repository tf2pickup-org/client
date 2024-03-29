import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '@app/api-url';
import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_URL, useValue: 'FAKE_URL' }],
    });
    service = TestBed.inject(DocumentsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchDocument()', () => {
    it('should call the endpoint', () => {
      service.fetchDocument('rules').subscribe();
      httpController.expectOne('FAKE_URL/documents/rules');
      expect().nothing();
    });
  });

  describe('#saveDocument()', () => {
    it('should call the endpoint', () => {
      service.saveDocument('rules', 'bla bla bla').subscribe();
      const request = httpController.expectOne(
        'FAKE_URL/documents/rules',
      ).request;
      expect(request.method).toBe('PUT');
      expect(request.body).toEqual({
        name: 'rules',
        language: 'en',
        body: 'bla bla bla',
      });
    });
  });
});
