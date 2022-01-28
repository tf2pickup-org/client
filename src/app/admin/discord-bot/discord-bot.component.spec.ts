import { Location } from '@angular/common';
import { ConfigurationService } from '@app/configuration/configuration.service';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { DiscordBotComponent } from './discord-bot.component';
import { DiscordService } from '@app/admin/discord.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, take } from 'rxjs';
import { GuildInfo } from '../models/guild-info';
import { TextChannelInfo } from '../models/text-channel-info';
import { RoleInfo } from '../models/role-info';
import { Discord } from '@app/configuration/models/discord';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { SortRolesPipe } from './sort-roles.pipe';
import { SortChannelsPipe } from './sort-channels.pipe';

fdescribe(DiscordBotComponent.name, () => {
  let component: DiscordBotComponent;
  let fixture: MockedComponentFixture<DiscordBotComponent>;
  let guilds: Subject<GuildInfo[]>;
  let textChannels: Subject<TextChannelInfo[]>;
  let roles: Subject<RoleInfo[]>;
  let discordConfiguration: Subject<Discord>;

  beforeEach(() => {
    guilds = new Subject();
    textChannels = new Subject();
    roles = new Subject();
    discordConfiguration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(DiscordBotComponent)
      .mock(ConfigurationService, {
        fetchValue: jasmine.createSpy('fetchValue').and.callFake(
          key =>
            ({
              [ConfigurationEntryKey.discord]: discordConfiguration.pipe(
                take(1),
              ),
            }[key]),
        ),
        storeValue: jasmine.createSpy('storeValue').and.callFake(
          entry =>
            ({
              [ConfigurationEntryKey.discord]: discordConfiguration.pipe(
                take(1),
              ),
            }[entry.key]),
        ),
      })
      .mock(DiscordService, {
        fetchGuilds: jasmine
          .createSpy('fetchGuilds')
          .and.returnValue(guilds.pipe(take(1))),
        fetchTextChannels: jasmine
          .createSpy('fetchTextChannels')
          .and.returnValue(textChannels.pipe(take(1))),
        fetchRoles: jasmine
          .createSpy('fetchRoles')
          .and.returnValue(roles.pipe(take(1))),
      })
      .keep(ReactiveFormsModule)
      .keep(SortRolesPipe)
      .keep(SortChannelsPipe)
      .mock(Location),
  );

  beforeEach(() => {
    fixture = MockRender(DiscordBotComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when all guilds are fetched', () => {
    beforeEach(() => {
      guilds.next([
        {
          id: 'FAKE_GUILD_ID',
          name: 'FAKE_GUILD',
          icon: 'FAKE_ICON_URL',
          textChannels: [{ id: '1', name: 'FAKE_TEXT_CHANNEL', position: 0 }],
          roles: [],
        },
      ]);
      fixture.detectChanges();
    });

    it('should render configuration fields for all guilds', () => {
      expect(
        (ngMocks.find('.guild-name').nativeElement as HTMLElement).innerText,
      ).toEqual('FAKE_GUILD');
      expect(
        (ngMocks.find('.guild-icon').nativeElement as HTMLImageElement).src,
      ).toMatch('FAKE_ICON_URL');
    });

    it('should render all text channels', () => {
      const adminsChannelSelect = ngMocks.find(
        '.admin-notifications-channel-id-select',
      ).nativeElement as HTMLSelectElement;
      expect(adminsChannelSelect.options[0].value).toEqual('null');
      expect(adminsChannelSelect.options[1].label).toEqual('FAKE_TEXT_CHANNEL');

      const playersChannelSelect = ngMocks.find(
        '.queue-notifications-channel-id-select',
      ).nativeElement as HTMLSelectElement;
      expect(playersChannelSelect.options[0].value).toEqual('null');
      expect(playersChannelSelect.options[1].label).toEqual(
        'FAKE_TEXT_CHANNEL',
      );
    });

    describe('and when the configuration is fetched', () => {
      beforeEach(() => {
        discordConfiguration.next({
          key: ConfigurationEntryKey.discord,
          guilds: [
            {
              guildId: 'FAKE_GUILD_ID',
              queueNotificationsChannelId: '1',
            },
          ],
        });
        fixture.detectChanges();
      });

      it('should select the proper channel', () => {
        const select = ngMocks.find('.queue-notifications-channel-id-select')
          .nativeElement as HTMLSelectElement;
        expect(select.options[select.selectedIndex].label).toEqual(
          'FAKE_TEXT_CHANNEL',
        );
      });
    });
  });
});
