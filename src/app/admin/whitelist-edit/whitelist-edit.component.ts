import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MDCTextField } from '@material/textfield';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

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
    this.configurationService.fetchConfiguration().subscribe(configuration => {
      this.form.patchValue({ whitelistId: configuration.whitelistId });
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
    this.configurationService.fetchConfiguration().pipe(
      switchMap(configuration => this.configurationService.setConfiguration({ ...configuration, whitelistId: this.form.get('whitelistId').value })),
      tap(configuration => this.form.reset(configuration)),
    ).subscribe(() => {
      this.isSaving.next(false);
    });
  }

}
