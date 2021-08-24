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
    mumble: this.formBuilder.group({
      url: '',
      port: 64738,
      password: '',
      channelName: '',
    }),
  });

  initialMumbleOptions = new Subject<MumbleOptions>();

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
          mumble: voiceServer,
        });

        switch (voiceServer.type) {
          case 'mumble':
            this.initialMumbleOptions.next(voiceServer);
            break;
        }

        this.changeDetector.markForCheck();
        this.textFields.forEach(field => field?.layout());
      });

    this.form.get('type').valueChanges.subscribe(type => {
      switch (type) {
        case 'null':
          this.form.get('mumble').disable();
          break;

        case 'mumble':
          this.form.get('mumble').enable();
          break;
      }
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

  get type(): VoiceServer['type'] {
    return this.form.get('type').value;
  }

  save() {
    let voiceServer: VoiceServer;

    switch (this.type) {
      case 'mumble':
        const { url, port, password, channelName } = this.form.value.mumble;
        voiceServer = {
          type: 'mumble',
          url,
          port,
          password,
          channelName,
        };
        break;

      case 'null':
        voiceServer = { type: 'null' };
        break;
    }

    this.configurationService
      .storeValue<VoiceServer>(ConfigurationEntryKey.voiceServer, voiceServer)
      .subscribe(() => this.location.back());
  }
}
