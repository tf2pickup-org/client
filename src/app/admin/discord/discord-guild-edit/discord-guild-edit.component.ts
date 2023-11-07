import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DiscordService } from '../discord.service';
import { ReplaySubject, distinctUntilChanged, map } from 'rxjs';
import { TextChannel } from '../models/text-channel';
import { FormControl, FormGroup } from '@angular/forms';
import { Role } from '../models/role';

@Component({
  selector: 'app-discord-guild-edit',
  templateUrl: './discord-guild-edit.component.html',
  styleUrls: ['./discord-guild-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscordGuildEditComponent implements OnInit {
  @Input()
  guildControl: FormGroup<{
    id: FormControl<string>;
    name: FormControl<string>;
    isEnabled: FormControl<boolean>;
    adminNotifications: FormGroup<{ channel: FormControl<string | null> }>;
    substituteNotifications: FormGroup<{
      channel: FormControl<string | null>;
      role: FormControl<string | null>;
    }>;
    queuePrompts: FormGroup<{ channel: FormControl<string | null> }>;
  }>;

  textChannels = new ReplaySubject<Map<string, TextChannel[]>>(1);
  roles = new ReplaySubject<Role[]>(1);

  constructor(private readonly discordService: DiscordService) {}

  ngOnInit() {
    this.guildControl
      .get('isEnabled')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(isEnabled => {
        if (isEnabled) {
          this.loadTextChannels();
          this.loadRoles();
        }
      });

    if (this.guildControl.get('isEnabled').value) {
      this.loadTextChannels();
      this.loadRoles();
    }
  }

  loadTextChannels() {
    this.discordService
      .fetchTextChannels(this.guildControl.get('id').value)
      .pipe(
        map(textChannels =>
          textChannels.reduce((prev, curr) => {
            if (!prev.has(curr.parent)) {
              prev.set(curr.parent, []);
            }

            prev.get(curr.parent).push(curr);
            return prev;
          }, new Map<string, TextChannel[]>()),
        ),
        map(groups => {
          groups.forEach(value =>
            value.sort((a, b) => a.position - b.position),
          );
          return groups;
        }),
      )
      .subscribe(textChannels => this.textChannels.next(textChannels));
  }

  loadRoles() {
    this.discordService
      .fetchRoles(this.guildControl.get('id').value)
      .pipe(map(roles => roles.sort((a, b) => a.name.localeCompare(b.name))))
      .subscribe(roles => this.roles.next(roles));
  }
}
