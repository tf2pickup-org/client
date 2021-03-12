import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AcceptRulesDialogComponent } from './accept-rules-dialog.component';
import { By } from '@angular/platform-browser';
import { MarkdownComponent } from 'ngx-markdown';
import { MockComponent, MockProvider, ngMocks } from 'ng-mocks';
import { DocumentsService } from '@app/documents/documents.service';
import { Document } from '@app/documents/models/document';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('AcceptRulesDialogComponent', () => {
  let component: AcceptRulesDialogComponent;
  let fixture: ComponentFixture<AcceptRulesDialogComponent>;
  let document: Subject<Document>;

  beforeEach(() => {
    document = new Subject();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AcceptRulesDialogComponent,
        MockComponent(MarkdownComponent),
      ],
      providers: [
        MockProvider(DocumentsService, {
          fetchDocument: jasmine.createSpy('fetchDocument').and.returnValue(document.pipe(take(1))),
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the mumble confirmation button', () => {
    expect(fixture.debugElement.query(By.css('.confirm-mumble-button')).nativeElement).toBeTruthy();
  });

  describe('when the user confirms mumble', () => {
    beforeEach(() => {
      const button = fixture.debugElement.query(By.css('.confirm-mumble-button')).nativeElement as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
    });

    it('should render the accept rules button', () => {
      expect(fixture.debugElement.query(By.css('.accept-rules-button')).nativeElement).toBeTruthy();
    });

    it('should render the rules document', () => {
      document.next({ name: 'rules', language: 'en', body: 'some rules' });
      fixture.detectChanges();

      const rules = ngMocks.findInstance(MarkdownComponent);
      expect(rules.data).toEqual('some rules');
    });

    describe('when the user accepts the rules', () => {
      it('should emit rulesAccepted', done => {
        component.rulesAccepted.subscribe(done);

        const button = fixture.debugElement.query(By.css('.accept-rules-button')).nativeElement as HTMLButtonElement;
        button.click();
        fixture.detectChanges();

        expect().nothing();
      });
    });
  });
});
