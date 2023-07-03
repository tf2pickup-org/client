import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditPageWrapperComponent } from '@app/admin/edit-page-wrapper/edit-page-wrapper.component';
import { CountryFlagPipe } from '@app/shared/country-flag.pipe';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { of, Subject, take } from 'rxjs';
import { ServemeTfService } from '../serveme-tf.service';
import { ServemeTfConfigurationComponent } from './serveme-tf-configuration.component';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationEntry } from '@app/configuration/models/configuration-entry';

describe(ServemeTfConfigurationComponent.name, () => {
  let component: ServemeTfConfigurationComponent;
  let fixture: MockedComponentFixture<ServemeTfConfigurationComponent>;
  let configuration: Subject<ConfigurationEntry[]>;
  const mockServers = [
    {
      flag: 'fr',
    },
    {
      flag: 'fr',
    },
    {
      flag: 'de',
    },
  ];
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(ServemeTfConfigurationComponent)
      .mock(ServemeTfService, {
        fetchAllServers: jasmine
          .createSpy('fetchAllServers')
          .and.returnValue(of(mockServers)),
      })
      .mock(ConfigurationService, {
        storeValues: jasmine
          .createSpy('storeValues')
          .and.returnValue(configuration.pipe(take(1))),
      })
      .mock(ActivatedRoute, {
        data: of({
          configuration: {
            preferredRegion: undefined,
          },
        }),
      })
      .keep(EditPageWrapperComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .keep(CountryFlagPipe)
      .mock(Location),
  );

  beforeEach(() => {
    fixture = MockRender(ServemeTfConfigurationComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill the available regions', () => {
    const options = ngMocks.findAll('option');
    expect(options.length).toBe(3);
  });

  describe('when the configuration is fetched', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should keep the submit button disabled', () => {
      expect(submitButton.disabled).toBe(true);
    });

    describe('and when another region is selected', () => {
      beforeEach(() => {
        const select = ngMocks.find('select')
          .nativeElement as HTMLSelectElement;
        select.value = select.options[2].value;
        select.dispatchEvent(new Event('change'));
        fixture.detectChanges();
      });

      it('should enable the submit button', () => {
        expect(submitButton.disabled).toBe(false);
      });

      describe('when the form is submitted', () => {
        beforeEach(() => {
          submitButton.click();
          fixture.detectChanges();
        });

        it('should save the configuration', () => {
          const configurationService = TestBed.inject(ConfigurationService);
          expect(configurationService.storeValues).toHaveBeenCalledWith({
            key: 'serveme_tf.preferred_region',
            value: 'de',
          });
        });

        describe('when the configuration is saved', () => {
          beforeEach(() => {
            configuration.next([
              {
                key: 'serveme_tf.preferred_region',
                value: 'de',
                schema: { type: 'string' },
              },
            ]);
            fixture.detectChanges();
          });

          it('should navigate back', () => {
            const location = TestBed.inject(Location);
            expect(location.back).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
