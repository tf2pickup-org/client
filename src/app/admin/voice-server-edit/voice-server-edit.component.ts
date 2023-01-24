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
import { ConfigurationService } from '@app/configuration/configuration.service';
import { MDCTextField } from '@material/textfield';
import { Location } from '@angular/common';
import { map, Subject } from 'rxjs';

interface MumbleOptions {
  url: string;
  port: number;
  password?: string;
  channelName?: string;
}

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
      .fetchValues<[string, string, string, number, string, string]>(
        'games.voice_server_type',
        'games.voice_server.static_link',
        'games.voice_server.mumble.url',
        'games.voice_server.mumble.port',
        'games.voice_server.mumble.channel_name',
        'games.voice_server.mumble.password',
      )
      .pipe(
        map(
          ([
            voiceServerType,
            staticLink,
            mumbleUrl,
            mumblePort,
            mumbleChannelName,
            mumblePassword,
          ]) => ({
            voiceServerType: voiceServerType.value,
            staticLink: staticLink.value,
            mumble: {
              url: mumbleUrl.value,
              port: mumblePort.value,
              password: mumblePassword.value,
              channelName: mumbleChannelName.value,
            },
          }),
        ),
      )
      .subscribe(({ voiceServerType, staticLink, mumble }) => {
        this.form.patchValue({
          type: voiceServerType,
          staticLink: staticLink,
          mumble,
        });

        this.initialStaticLink.next(staticLink);
        this.initialMumbleOptions.next(mumble);
        this.changeDetector.markForCheck();
        this.textFields.forEach(field => field?.layout());
      });

    this.form.get('type').valueChanges.subscribe(type => {
      switch (type) {
        case 'none':
          this.form.get('staticLink').disable();
          this.form.get('mumble').disable();
          break;

        case 'static link':
          this.form.get('staticLink').enable();
          this.form.get('mumble').disable();
          break;

        case 'mumble':
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

  get type(): string {
    return this.form.get('type').value;
  }

  save() {
    const { url, port, password, channelName } = this.form.get('mumble').value;
    this.configurationService
      .storeValues(
        {
          key: 'games.voice_server_type',
          value: this.form.value.type,
        },
        {
          key: 'games.voice_server.static_link',
          value: this.form.get('staticLink').value,
        },
        {
          key: 'games.voice_server.mumble.url',
          value: url,
        },
        {
          key: 'games.voice_server.mumble.port',
          value: port,
        },
        {
          key: 'games.voice_server.mumble.channel_name',
          value: channelName,
        },
        {
          key: 'games.voice_server.mumble.password',
          value: password,
        },
      )
      .subscribe(() => this.location.back());
  }
}
