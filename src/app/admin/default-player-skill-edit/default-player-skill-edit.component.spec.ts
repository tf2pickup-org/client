import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { Configuration } from '@app/configuration/models/configuration';
import { queueConfig } from '@app/queue/queue.selectors';
import { GameClassIconComponent } from '@app/shared/game-class-icon/game-class-icon.component';
import { provideMockStore } from '@ngrx/store/testing';
import { FeatherComponent } from 'angular-feather';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { EditPageWrapperComponent } from '../edit-page-wrapper/edit-page-wrapper.component';
import { DefaultPlayerSkillEditComponent } from './default-player-skill-edit.component';

describe(DefaultPlayerSkillEditComponent.name, () => {
  let component: DefaultPlayerSkillEditComponent;
  let fixture: MockedComponentFixture<DefaultPlayerSkillEditComponent>;
  let configuration: Subject<Configuration>;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() => MockBuilder(DefaultPlayerSkillEditComponent)
    .keep(ReactiveFormsModule)
    .mock(ConfigurationService, {
      fetchConfiguration: jasmine.createSpy('fetchConfiguration').and.returnValue(configuration.asObservable().pipe(take(1))),
      setConfiguration: jasmine.createSpy('setConfiguration').and.returnValue(configuration.asObservable().pipe(take(1))),
    })
    .provide(provideMockStore({
      selectors: [
        {
          selector: queueConfig,
          value: {
            teamCount: 2,
            classes: [
              { name: 'scout', count: 2 },
              { name: 'soldier', count: 2 },
            ],
          },
        },
      ]
    }))
    .keep(EditPageWrapperComponent)
    .mock(FeatherComponent)
    .mock(GameClassIconComponent)
  );

  beforeEach(() => {
    fixture = MockRender(DefaultPlayerSkillEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;

    configuration.next({ defaultPlayerSkill: { scout: 1, soldier: 2 } });
    fixture.detectChanges();
  });

  afterEach(() => configuration.complete());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button', () => {
    expect(submitButton.disabled).toBe(true);
  });

  it('should render input for each game class', () => {
    expect(ngMocks.findAll('input[type=number]').length).toEqual(2);
    const gameClassIcons = ngMocks.findAll('app-game-class-icon').map(c => c.componentInstance);
    expect(gameClassIcons.length).toEqual(2);
    expect(gameClassIcons[0].gameClass).toEqual('scout');
    expect(gameClassIcons[1].gameClass).toEqual('soldier');
  });

  describe('when a skill is edited', () => {
    let soldierInput: HTMLInputElement;

    beforeEach(() => {
      soldierInput = ngMocks.find('input[type=number][name=soldier]').nativeElement;
      soldierInput.valueAsNumber = 4;
      soldierInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    });

    it('should enable the submit button', () => {
      expect(submitButton.disabled).toBe(false);
    });

    describe('when submitted', () => {
      beforeEach(() => {
        submitButton.click();
        fixture.detectChanges();
        configuration.next({ defaultPlayerSkill: { scout: 1, soldier: 2 } });
      });

      it('should disable the submit button', () => {
        expect(submitButton.disabled).toBe(true);
      });

      it('should call the api', () => {
        const configurationService = TestBed.inject(ConfigurationService);
        expect(configurationService.setConfiguration).toHaveBeenCalledWith({ defaultPlayerSkill: { scout: 1, soldier: 4 } });
      });

      describe('when accepted by the server', () => {
        beforeEach(() => {
          configuration.next({ defaultPlayerSkill: { scout: 1, soldier: 4 } });
          fixture.detectChanges();
        });

        it('should keep the submit button disabled', () => {
          expect(submitButton.disabled).toBe(true);
        });
      });
    });
  });
});
