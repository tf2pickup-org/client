import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MDCTextField } from '@material/textfield';
import { BehaviorSubject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhitelistEditComponent implements OnInit, AfterViewInit, OnDestroy {

  isSaving = new BehaviorSubject<boolean>(false);

  form = this.formBuilder.group({
    whitelistId: [''],
  });

  @ViewChild('whitelistId')
  whitelistIdControl: ElementRef;

  private whitelistIdField: MDCTextField;

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.configurationService.fetchValue<string>(ConfigurationEntryKey.whitelistId).subscribe(whitelistId => {
      this.form.patchValue({ whitelistId });
      this.changeDetector.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.whitelistIdField = new MDCTextField(this.whitelistIdControl.nativeElement);
  }

  ngOnDestroy() {
    this.whitelistIdField?.destroy();
  }

  save() {
    this.isSaving.next(true);
    this.configurationService.storeValue<string>(ConfigurationEntryKey.whitelistId, `${this.whitelistId}`).pipe(
      tap(whitelistId => this.form.reset({ whitelistId })),
      finalize(() => this.isSaving.next(false)),
    ).subscribe();
  }

  get whitelistId() {
    return this.form.get('whitelistId').value;
  }

}
