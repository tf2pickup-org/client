import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Documents } from '@app/documents/documents';
import { DocumentsService } from '@app/documents/documents.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-accept-rules-dialog',
  templateUrl: './accept-rules-dialog.component.html',
  styleUrls: ['./accept-rules-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptRulesDialogComponent {
  rulesAccepted = new Subject<void>();
  phase = new BehaviorSubject<'mumble' | 'rules'>('mumble');
  rules = this.documentsService
    .fetchDocument(Documents.rules)
    .pipe(pluck('body'));

  constructor(private documentsService: DocumentsService) {}

  step() {
    switch (this.phase.value) {
      case 'mumble':
        this.phase.next('rules');
        break;

      case 'rules':
        this.rulesAccepted.next();
        break;
    }
  }
}
