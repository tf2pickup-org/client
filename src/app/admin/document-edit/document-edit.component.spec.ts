import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { DocumentsService } from '@app/documents/documents.service';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DocumentEditComponent } from './document-edit.component';
import { Document } from '@app/documents/models/document';
import { FeatherComponent } from 'angular-feather';
import { MarkdownComponent } from 'ngx-markdown';
import { TestBed } from '@angular/core/testing';

describe(DocumentEditComponent.name, () => {
  let component: DocumentEditComponent;
  let fixture: MockedComponentFixture<DocumentEditComponent>;
  let submitButton: HTMLButtonElement;
  let textarea: HTMLTextAreaElement;
  let routeData: Subject<any>;
  let saveDocument: Subject<Document>;

  beforeEach(() => {
    routeData = new Subject();
    saveDocument = new Subject();
  });

  beforeEach(() =>
    MockBuilder(DocumentEditComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(ActivatedRoute, {
        data: routeData.asObservable(),
      })
      .mock(DocumentsService, {
        saveDocument: jasmine
          .createSpy('saveDocument')
          .and.returnValue(saveDocument.pipe(take(1))),
      })
      .mock(FeatherComponent)
      .mock(MarkdownComponent),
  );

  beforeEach(() => {
    fixture = MockRender(DocumentEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;
    textarea = ngMocks.find('textarea').nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button', () => {
    expect(submitButton.disabled).toBe(true);
  });

  describe('when the document is loaded', () => {
    beforeEach(() => {
      routeData.next({
        document: {
          name: 'rules',
          language: 'en',
          body: 'some rules bla bla bla',
        },
      });
      fixture.detectChanges();
    });

    it('should fill the textarea content', () => {
      expect(textarea.value).toEqual('some rules bla bla bla');
    });

    it('should render the markdown', () => {
      const markdown = ngMocks.findInstance(MarkdownComponent);
      expect(markdown.data).toEqual('some rules bla bla bla');
    });

    describe('when the content is edited', () => {
      beforeEach(() => {
        textarea.value = 'lol';
        textarea.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('should enable the save button', () => {
        expect(submitButton.disabled).toBe(false);
      });

      it('should update the markdown', () => {
        const markdown = ngMocks.findInstance(MarkdownComponent);
        expect(markdown.data).toEqual('lol');
      });

      describe('when the document is submitted', () => {
        beforeEach(() => {
          submitButton.click();
          fixture.detectChanges();
        });

        it('should disable the submit button', () => {
          expect(submitButton.disabled).toBe(true);
        });

        it('should attempt to update the document', () => {
          const documentsService = TestBed.inject(DocumentsService);
          expect(documentsService.saveDocument).toHaveBeenCalledWith(
            'rules',
            'lol',
          );
        });

        describe('when the document is updated', () => {
          beforeEach(() => {
            saveDocument.next({ name: 'rules', body: 'lol', language: 'en' });
            fixture.detectChanges();
          });

          it('should keep the submit button disabled', () => {
            expect(submitButton.disabled).toBe(true);
          });
        });
      });
    });
  });
});
