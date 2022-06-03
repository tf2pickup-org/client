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
import { FormBuilder, Validators } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MDCTextField } from '@material/textfield';
import {
  SelectedVoiceServer,
  VoiceServer,
} from '@app/configuration/models/voice-server';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { MumbleOptions } from '@app/configuration/models/mumble-options';

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
    type: '',
    staticLink: '',
    mumble: this.formBuilder.group({
      url: '',
      port: 64738,
      password: '',
      channelName: '',
    }),
  });

  initialMumbleOptions = new Subject<MumbleOptions>();
  initialStaticLink = new Subject<string>();

  @ViewChild('staticLink')
  staticLinkInput: ElementRef;

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
      .subscribe(voiceServer => {
        this.form.patchValue({
          type: voiceServer.type,
          staticLink: voiceServer.staticLink,
          mumble: voiceServer.mumble,
        });

        this.initialStaticLink.next(voiceServer.staticLink);
        this.initialMumbleOptions.next(voiceServer.mumble);
        this.changeDetector.markForCheck();
        this.textFields.forEach(field => field?.layout());
      });

    this.form.get('type').valueChanges.subscribe(type => {
      switch (type) {
        case SelectedVoiceServer.none:
          this.form.get('staticLink').disable();
          this.form.get('mumble').disable();
          break;

        case SelectedVoiceServer.staticLink:
          this.form.get('staticLink').enable();
          this.form.get('mumble').disable();
          break;

        case SelectedVoiceServer.mumble:
          this.form.get('staticLink').disable();
          this.form.get('mumble').enable();
          break;
      }
    });
  }

  ngAfterViewInit() {
    this.textFields = [
      this.staticLinkInput,
      this.mumbleServerUrlInput,
      this.mumbleServerPortInput,
      this.mumbleServerPassword,
      this.mumbleServerChannelName,
    ].map(input => new MDCTextField(input.nativeElement));
  }

  ngOnDestroy() {
    this.textFields.forEach(field => field.destroy());
  }

  get type(): VoiceServer['type'] {
    return this.form.get('type').value as SelectedVoiceServer;
  }

  save() {
    let voiceServer: VoiceServer;

    switch (this.type) {
      case SelectedVoiceServer.none:
        voiceServer = {
          key: ConfigurationEntryKey.voiceServer,
          type: SelectedVoiceServer.none,
        };
        break;

      case SelectedVoiceServer.staticLink:
        voiceServer = {
          key: ConfigurationEntryKey.voiceServer,
          type: SelectedVoiceServer.staticLink,
          staticLink: this.form.value.staticLink,
        };
        break;

      case SelectedVoiceServer.mumble:
        const { url, port, password, channelName } = this.form.value.mumble;
        voiceServer = {
          key: ConfigurationEntryKey.voiceServer,
          type: SelectedVoiceServer.mumble,
          mumble: {
            url,
            port,
            password,
            channelName,
          },
        };
        break;
    }

    this.configurationService
      .storeValue(voiceServer)
      .subscribe(() => this.location.back());
  }
}
