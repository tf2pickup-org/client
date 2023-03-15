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
import { WhitelistEditComponent } from './whitelist-edit.component';

describe(WhitelistEditComponent.name, () => {
  let component: WhitelistEditComponent;
  let fixture: MockedComponentFixture<WhitelistEditComponent>;
  let configuration: Subject<Record<string, any>>;
  let submitButton: HTMLButtonElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(WhitelistEditComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
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
      .mock(TablerIconComponent)
      .keep(EditPageWrapperComponent),
  );

  beforeEach(() => {
    fixture = MockRender(WhitelistEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;
    input = ngMocks.find('input[type=text]').nativeElement;

    configuration.next({
      'games.whitelist_id': 'etf2l_9v9',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button', () => {
    expect(submitButton.disabled).toBe(true);
  });

  xit('should set the whitelistId input value', () => {
    expect(input.value).toEqual('etf2l_9v9');
  });

  describe('when edited', () => {
    beforeEach(() => {
      input.value = 'etf2l_6v6';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    });

    it('should enable the submit button', () => {
      expect(submitButton.disabled).toBe(false);
    });

    describe('when submitted', () => {
      beforeEach(() => {
        submitButton.click();
        fixture.detectChanges();
        configuration.next({
          'games.whitelist_id': 'etf2l_9v9',
        });
      });

      it('should disable the submit button', () => {
        expect(submitButton.disabled).toBe(true);
      });

      it('should set the new configuration', () => {
        const configurationService = TestBed.inject(ConfigurationService);
        expect(configurationService.storeValues).toHaveBeenCalledWith({
          key: 'games.whitelist_id',
          value: 'etf2l_6v6',
        });
      });

      describe('when the new configuration is set', () => {
        beforeEach(() => {
          configuration.next({
            'games.whitelist_id': 'etf2l_6v6',
          });
          fixture.detectChanges();
        });

        it('should keep the submit button disabled', () => {
          expect(submitButton.disabled).toBe(true);
        });
      });
    });
  });
});
