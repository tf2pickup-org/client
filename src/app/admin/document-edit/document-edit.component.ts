import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from '@app/documents/documents.service';
import { MDCTextField } from '@material/textfield';
import { BehaviorSubject, Subject } from 'rxjs';
import { pluck, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditComponent implements OnInit, AfterViewInit, OnDestroy {
  isSaving = new BehaviorSubject<boolean>(false);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    body: [''],
  });

  @ViewChild('documentEdit')
  documentEditControl: ElementRef;

  private destroyed = new Subject<void>();
  private documentEditField: MDCTextField;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(pluck('document'), takeUntil(this.destroyed))
      .subscribe(document => {
        this.form.patchValue({ body: document.body, name: document.name });
        this.changeDetector.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.documentEditField = new MDCTextField(
      this.documentEditControl.nativeElement,
    );
  }

  ngOnDestroy() {
    this.documentEditField?.destroy();
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.isSaving.next(true);
    this.documentsService
      .saveDocument(this.name.value, this.body.value)
      .pipe(
        tap(document =>
          this.form.reset({ body: document.body, name: document.name }),
        ),
      )
      .subscribe(() => {
        this.isSaving.next(false);
      });
  }

  get body() {
    return this.form.get('body');
  }

  get name() {
    return this.form.get('name');
  }
}
