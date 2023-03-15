import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Player } from '@app/players/models/player';
import { PlayersService } from '@app/players/players.service';
import { TablerIconComponent } from 'angular-tabler-icons';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { of } from 'rxjs';
import { EditPageWrapperComponent } from '../edit-page-wrapper/edit-page-wrapper.component';
import { ForceCreatePlayerAccountComponent } from './force-create-player-account.component';

describe(ForceCreatePlayerAccountComponent.name, () => {
  let component: ForceCreatePlayerAccountComponent;
  let fixture: MockedComponentFixture<ForceCreatePlayerAccountComponent>;
  let playersService: jasmine.SpyObj<PlayersService>;
  let location: jasmine.SpyObj<Location>;
  let nameInput: HTMLInputElement;
  let steamIdInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(() =>
    MockBuilder(ForceCreatePlayerAccountComponent)
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(PlayersService)
      .mock(Location)
      .mock(TablerIconComponent)
      .keep(EditPageWrapperComponent),
  );

  beforeEach(() => {
    fixture = MockRender(ForceCreatePlayerAccountComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    playersService = TestBed.inject(
      PlayersService,
    ) as jasmine.SpyObj<PlayersService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    nameInput = ngMocks.find('input.input-name')
      .nativeElement as HTMLInputElement;
    steamIdInput = ngMocks.find('input.input-steam-id')
      .nativeElement as HTMLInputElement;
    submitButton = ngMocks.find('button[type=submit]')
      .nativeElement as HTMLButtonElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form inputs', () => {
    expect(nameInput).toBeTruthy();
    expect(steamIdInput).toBeTruthy();
  });

  it('should render submit button', () => {
    expect(submitButton).toBeTruthy();
  });

  describe('when the form is invalid', () => {
    it('should disable the submit button', () => {
      expect(submitButton.disabled).toBe(true);
    });
  });

  describe('when the form is valid', () => {
    beforeEach(() => {
      nameInput.value = 'FAKE_PLAYER_NAME';
      nameInput.dispatchEvent(new Event('input'));

      steamIdInput.value = '76561198074409147';
      steamIdInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
    });

    it('should enable the submit button', () => {
      expect(submitButton.disabled).toBe(false);
    });

    describe('and when submitted', () => {
      beforeEach(() => {
        playersService.forceCreatePlayer.and.returnValue(
          of({
            name: 'FAKE_PLAYER_NAME',
            steamId: '76561198074409147',
          } as Player),
        );
        submitButton.click();
      });

      it('should call the api', () => {
        expect(playersService.forceCreatePlayer).toHaveBeenCalledOnceWith({
          name: 'FAKE_PLAYER_NAME',
          steamId: '76561198074409147',
        });
      });

      it('should eventually redirect back', () => {
        expect(location.back).toHaveBeenCalledTimes(1);
      });
    });
  });
});
