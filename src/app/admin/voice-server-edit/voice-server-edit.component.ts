import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MDCTextField } from '@material/textfield';
import { VoiceServer } from '@app/configuration/models/voice-server';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-voice-server-edit',
  templateUrl: './voice-server-edit.component.html',
  styleUrls: ['./voice-server-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceServerEditComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  form = this.formBuilder.group({
    mumble: this.formBuilder.group({
      url: '',
      port: 64738,
      password: '',
      channelName: '',
    }),
  });

  initialValue = new Subject<VoiceServer>();

  @ViewChild('mumbleServerUrl')
  mumbleServerUrlInput: ElementRef;

  @ViewChild('mumbleServerPort')
  mumbleServerPortInput: ElementRef;

  @ViewChild('mumbleServerPassword')
  mumbleServerPassword: ElementRef;

  @ViewChild('mumbleServerChannelName')
  mumbleServerChannelName: ElementRef;

  private textFields: MDCTextField[];

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private changeDetector: ChangeDetectorRef,
    private location: Location,
  ) {}

  ngOnInit() {
    this.configurationService
      .fetchValue<VoiceServer>(ConfigurationEntryKey.voiceServer)
      .subscribe(mumble => {
        this.form.patchValue({ mumble });
        this.initialValue.next(mumble);
        this.changeDetector.markForCheck();
        this.textFields.forEach(field => field?.layout());
      });
  }

  ngAfterViewInit() {
    this.textFields = [
      this.mumbleServerUrlInput,
      this.mumbleServerPortInput,
      this.mumbleServerPassword,
      this.mumbleServerChannelName,
    ].map(input => new MDCTextField(input.nativeElement));
  }

  ngOnDestroy() {
    this.textFields.forEach(field => field.destroy());
  }

  save() {
    const mumble = this.form.value.mumble as VoiceServer;
    mumble.type = 'mumble';

    this.configurationService
      .storeValue<VoiceServer>(ConfigurationEntryKey.voiceServer, mumble)
      .subscribe(() => this.location.back());
  }
}
