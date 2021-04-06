import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
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
import { WhitelistEditComponent } from './whitelist-edit.component';

describe(WhitelistEditComponent.name, () => {
  let component: WhitelistEditComponent;
  let fixture: MockedComponentFixture<WhitelistEditComponent>;
  let whitelistId: Subject<string>;
  let submitButton: HTMLButtonElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    whitelistId = new Subject();
  });

  beforeEach(() =>
    MockBuilder(WhitelistEditComponent)
      .keep(ReactiveFormsModule)
      .mock(ConfigurationService, {
        fetchValue: jasmine
          .createSpy('fetchValue')
          .and.returnValue(whitelistId.asObservable().pipe(take(1))),
        storeValue: jasmine
          .createSpy('storeValue')
          .and.returnValue(whitelistId.asObservable().pipe(take(1))),
      })
      .mock(FeatherComponent)
      .keep(EditPageWrapperComponent),
  );

  beforeEach(() => {
    fixture = MockRender(WhitelistEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;
    input = ngMocks.find('input[type=text]').nativeElement;

    whitelistId.next('etf2l_9v9');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button', () => {
    expect(submitButton.disabled).toBe(true);
  });

  it('should set the whitelistId input value', () => {
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
        whitelistId.next('etf2l_9v9');
      });

      it('should disable the submit button', () => {
        expect(submitButton.disabled).toBe(true);
      });

      it('should set the new configuration', () => {
        const configurationService = TestBed.inject(ConfigurationService);
        expect(configurationService.storeValue).toHaveBeenCalledWith(
          ConfigurationEntryKey.whitelistId,
          'etf2l_6v6',
        );
      });

      describe('when the new configuration is set', () => {
        beforeEach(() => {
          whitelistId.next('etf2l_6v6');
          fixture.detectChanges();
        });

        it('should keep the submit button disabled', () => {
          expect(submitButton.disabled).toBe(true);
        });
      });
    });
  });
});
