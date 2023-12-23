import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { queueConfig } from '@app/queue/queue.selectors';
import { GameClassIconComponent } from '@app/shared/game-class-icon/game-class-icon.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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
import { DefaultPlayerSkillEditComponent } from './default-player-skill-edit.component';

describe(DefaultPlayerSkillEditComponent.name, () => {
  let component: DefaultPlayerSkillEditComponent;
  let fixture: MockedComponentFixture<DefaultPlayerSkillEditComponent>;
  let configuration: Subject<Record<string, unknown>>;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    configuration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(DefaultPlayerSkillEditComponent)
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
      .provide(
        provideMockStore({
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
          ],
        }),
      )
      .keep(EditPageWrapperComponent)
      .mock(TablerIconComponent)
      .mock(GameClassIconComponent),
  );

  beforeEach(() => {
    fixture = MockRender(DefaultPlayerSkillEditComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    submitButton = ngMocks.find('button[type=submit]').nativeElement;

    configuration.next({
      'games.default_player_skill': { scout: 1, soldier: 2 },
    });
    fixture.detectChanges();
  });

  afterEach(() => configuration.complete());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button', () => {
    expect(submitButton.disabled).toBe(true);
  });

  it('should render input for each game class', () => {
    expect(ngMocks.findAll('input[type=number]').length).toEqual(2);
    const gameClassIcons = ngMocks
      .findAll('app-game-class-icon')
      .map(c => c.componentInstance);
    expect(gameClassIcons.length).toEqual(2);
    expect(gameClassIcons[0].gameClass).toEqual('scout');
    expect(gameClassIcons[1].gameClass).toEqual('soldier');
  });

  describe('when a skill is edited', () => {
    let soldierInput: HTMLInputElement;

    beforeEach(() => {
      soldierInput = ngMocks.find(
        'input[type=number][name=soldier]',
      ).nativeElement;
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
        configuration.next({
          'games.default_player_skill': { scout: 1, soldier: 2 },
        });
      });

      it('should disable the submit button', () => {
        expect(submitButton.disabled).toBe(true);
      });

      it('should call the api', () => {
        const configurationService = TestBed.inject(ConfigurationService);
        expect(configurationService.storeValues).toHaveBeenCalledWith({
          key: 'games.default_player_skill',
          value: {
            scout: 1,
            soldier: 4,
          },
        });
      });

      describe('when accepted by the server', () => {
        beforeEach(() => {
          configuration.next({
            'games.default_player_skill': { scout: 1, soldier: 4 },
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
