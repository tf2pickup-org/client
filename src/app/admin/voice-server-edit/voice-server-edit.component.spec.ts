import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { TablerIconComponent } from 'angular-tabler-icons';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { EditPageWrapperComponent } from '../edit-page-wrapper/edit-page-wrapper.component';
import { VoiceServerEditComponent } from './voice-server-edit.component';

describe(VoiceServerEditComponent.name, () => {
  let component: VoiceServerEditComponent;
  let fixture: MockedComponentFixture<VoiceServerEditComponent>;
  let configuration: Subject<Record<string, unknown>>;
  let submitButton: HTMLButtonElement;
  let configurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(VoiceServerEditComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(Location)
      .mock(ConfigurationService, {
        fetchValues: jasmine.createSpy('fetchValue').and.callFake((...keys) =>
          configuration.pipe(
            filter(configuration => keys.every(key => key in configuration)),
            map(configuration =>
              keys.map(key => ({
                value: configuration[key],
              })),
            ),
            take(1),
          ),
        ),
        storeValues: jasmine
          .createSpy('storeValue')
          .and.callFake((...entries) =>
            configuration.pipe(
              filter(configuration =>
                entries.every(entry => entry.key in configuration),
              ),
              map(configuration =>
                entries.map(entry => configuration[entry.key]),
              ),
              take(1),
            ),
          ),
      })
      .keep(EditPageWrapperComponent)
      .mock(TablerIconComponent),
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

  describe('when the configuration is mumble', () => {
    beforeEach(() => {
      configuration.next({
        'games.voice_server_type': 'mumble',
        'games.voice_server.static_link': undefined,
        'games.voice_server.mumble.url': 'mumble.melkor.tf',
        'games.voice_server.mumble.port': 64738,
        'games.voice_server.mumble.channel_name': '',
        'games.voice_server.mumble.password': undefined,
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
          expect(configurationService.storeValues).toHaveBeenCalledOnceWith(
            { key: 'games.voice_server_type', value: 'mumble' },
            { key: 'games.voice_server.static_link', value: undefined },
            { key: 'games.voice_server.mumble.url', value: 'mumble.melkor.tf' },
            { key: 'games.voice_server.mumble.port', value: 64738 },
            { key: 'games.voice_server.mumble.channel_name', value: '' },
            {
              key: 'games.voice_server.mumble.password',
              value: 'FAKE_PASSWORD',
            },
          );
        });

        describe('when the values are saved on the server', () => {
          beforeEach(() => {
            configuration.next({
              'games.voice_server_type': 'mumble',
              'games.voice_server.static_link': undefined,
              'games.voice_server.mumble.url': 'mumble.melkor.tf',
              'games.voice_server.mumble.port': 64738,
              'games.voice_server.mumble.channel_name': '',
              'games.voice_server.mumble.password': 'FAKE_PASSWORD',
            });
            fixture.detectChanges();
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

    describe('when null voice server is selected and saved', () => {
      beforeEach(() => {
        const radio = ngMocks.find('#radio-voice-server-type-none')
          .nativeElement as HTMLInputElement;
        radio.click();
        fixture.detectChanges();
        submitButton.click();
      });

      it('should attempt to update the value', () => {
        expect(configurationService.storeValues).toHaveBeenCalledOnceWith(
          {
            key: 'games.voice_server_type',
            value: 'none',
          },
          jasmine.any(Object),
          jasmine.any(Object),
          jasmine.any(Object),
          jasmine.any(Object),
          jasmine.any(Object),
        );
      });
    });
  });

  describe('when the configuration is null', () => {
    beforeEach(() => {
      configuration.next({
        'games.voice_server_type': 'none',
        'games.voice_server.static_link': undefined,
        'games.voice_server.mumble.url': 'mumble.melkor.tf',
        'games.voice_server.mumble.port': 64738,
        'games.voice_server.mumble.channel_name': '',
        'games.voice_server.mumble.password': undefined,
      });
      fixture.detectChanges();
    });

    it('should check radio button', () => {
      const radio = ngMocks.find('#radio-voice-server-type-none')
        .nativeElement as HTMLInputElement;
      expect(radio.checked).toBe(true);
    });
  });

  describe('when the configuration is static link', () => {
    beforeEach(() => {
      configuration.next({
        'games.voice_server_type': 'static link',
        'games.voice_server.static_link': 'FAKE_LINK',
        'games.voice_server.mumble.url': 'mumble.melkor.tf',
        'games.voice_server.mumble.port': 64738,
        'games.voice_server.mumble.channel_name': '',
        'games.voice_server.mumble.password': undefined,
      });
      fixture.detectChanges();
    });

    it('should check radio button', () => {
      const radio = ngMocks.find('#radio-voice-server-type-static-link')
        .nativeElement as HTMLInputElement;
      expect(radio.checked).toBe(true);
    });

    describe('when the static link is changed', () => {
      beforeEach(() => {
        const input = ngMocks.find('#static-link-input')
          .nativeElement as HTMLInputElement;
        input.value = 'ANOTHER_FAKE_LINK';
        input.dispatchEvent(new Event('input'));
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
          expect(configurationService.storeValues).toHaveBeenCalledOnceWith(
            { key: 'games.voice_server_type', value: 'static link' },
            {
              key: 'games.voice_server.static_link',
              value: 'ANOTHER_FAKE_LINK',
            },
            jasmine.any(Object),
            jasmine.any(Object),
            jasmine.any(Object),
            jasmine.any(Object),
          );
        });

        describe('when the values are saved on the server', () => {
          beforeEach(() => {
            configuration.next({
              'games.voice_server_type': 'static link',
              'games.voice_server.static_link': 'ANOTHER_FAKE_LINK',
              'games.voice_server.mumble.url': 'mumble.melkor.tf',
              'games.voice_server.mumble.port': 64738,
              'games.voice_server.mumble.channel_name': '',
              'games.voice_server.mumble.password': undefined,
            });
            fixture.detectChanges();
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
