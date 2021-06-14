import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { VoiceServer } from '@app/configuration/models/voice-server';
import { FeatherComponent } from 'angular-feather';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { EditPageWrapperComponent } from '../edit-page-wrapper/edit-page-wrapper.component';
import { VoiceServerEditComponent } from './voice-server-edit.component';

describe(VoiceServerEditComponent.name, () => {
  let component: VoiceServerEditComponent;
  let fixture: MockedComponentFixture<VoiceServerEditComponent>;
  let voiceServer: Subject<VoiceServer>;
  let submitButton: HTMLButtonElement;
  let configurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    voiceServer = new Subject();
  });

  beforeEach(() =>
    MockBuilder(VoiceServerEditComponent)
      .keep(ReactiveFormsModule)
      .mock(Location)
      .mock(ConfigurationService, {
        fetchValue: jasmine.createSpy('fetchValue').and.callFake(
          key =>
            ({
              [ConfigurationEntryKey.voiceServer]: voiceServer.pipe(take(1)),
            }[key]),
        ),
        storeValue: jasmine.createSpy('storeValue').and.callFake(
          key =>
            ({
              [ConfigurationEntryKey.voiceServer]: voiceServer.pipe(take(1)),
            }[key]),
        ),
      })
      .keep(EditPageWrapperComponent)
      .mock(FeatherComponent),
  );

  beforeEach(() => {
    fixture = MockRender(VoiceServerEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    configurationService = TestBed.inject(
      ConfigurationService,
    ) as jasmine.SpyObj<ConfigurationService>;

    submitButton = ngMocks.find('button[type=submit]')
      .nativeElement as HTMLButtonElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button initially', () => {
    expect(submitButton.disabled).toBe(true);
  });

  describe('when the configuration is fetched', () => {
    beforeEach(() => {
      voiceServer.next({
        type: 'mumble',
        url: 'mumble.melkor.tf',
        port: 64738,
      });
      fixture.detectChanges();
    });

    it('should set values on inputs', () => {
      const mumbleServerUrlInput = ngMocks.find('#mumble-server-url-input')
        .nativeElement as HTMLInputElement;
      expect(mumbleServerUrlInput.value).toEqual('mumble.melkor.tf');

      const mumbleServerPortInput = ngMocks.find('#mumble-server-port-input')
        .nativeElement as HTMLInputElement;
      expect(mumbleServerPortInput.value).toEqual('64738');

      const mumbleServerPasswordInput = ngMocks.find(
        '#mumble-server-password-input',
      ).nativeElement as HTMLInputElement;
      expect(mumbleServerPasswordInput.value).toEqual('');
    });

    describe('when the password is updated', () => {
      beforeEach(() => {
        const mumbleServerPasswordInput = ngMocks.find(
          '#mumble-server-password-input',
        ).nativeElement as HTMLInputElement;
        mumbleServerPasswordInput.value = 'FAKE_PASSWORD';
        mumbleServerPasswordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('should enable the submit button', () => {
        expect(submitButton.disabled).toBe(false);
      });

      describe('when the form is saved', () => {
        beforeEach(() => {
          submitButton.click();
        });

        it('should attempt to update the value', () => {
          expect(configurationService.storeValue).toHaveBeenCalledOnceWith(
            ConfigurationEntryKey.voiceServer,
            {
              type: 'mumble',
              url: 'mumble.melkor.tf',
              port: 64738,
              password: 'FAKE_PASSWORD',
              channelName: '',
            },
          );
        });

        describe('when the values and saved on the server', () => {
          beforeEach(() => {
            voiceServer.next({
              type: 'mumble',
              url: 'mumble.melkor.tf',
              port: 64738,
              password: 'FAKE_PASSWORD',
            });
          });

          it('should navigate back', () => {
            const location = TestBed.inject(
              Location,
            ) as jasmine.SpyObj<Location>;
            expect(location.back).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
