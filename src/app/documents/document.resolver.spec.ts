import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { DocumentResolver } from './document.resolver';
import { DocumentsService } from './documents.service';

describe(DocumentResolver.name, () => {
  let resolver: DocumentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(DocumentsService, {
          fetchDocument: name =>
            of({
              name,
              language: 'en',
              body: 'fake document body',
            }),
        }),
      ],
    });
    resolver = TestBed.inject(DocumentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('#resolve()', () => {
    describe('when using route data', () => {
      it('should resolve the document', done => {
        resolver
          .resolve(
            {
              data: { documentName: 'rules' },
              params: {},
            } as unknown as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
          )
          .subscribe(document => {
            expect(document.name).toEqual('rules');
            done();
          });
      });
    });

    describe('when using route params', () => {
      it('should resolve the document', done => {
        resolver
          .resolve(
            {
              data: {},
              params: { documentName: 'foo' },
            } as unknown as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
          )
          .subscribe(document => {
            expect(document.name).toEqual('foo');
            done();
          });
      });
    });
  });
});
