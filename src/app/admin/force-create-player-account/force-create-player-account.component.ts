import { Location } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PlayersService } from '@app/players/players.service';

@Component({
  selector: 'app-force-create-player-account',
  templateUrl: './force-create-player-account.component.html',
  styleUrls: ['./force-create-player-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForceCreatePlayerAccountComponent {
  form = this.formBuilder.group({
    name: ['', Validators.required],
    steamId: ['', [Validators.required, Validators.pattern(/^\d{17}$/)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private playersService: PlayersService,
    private location: Location,
  ) {}

  save() {
    this.playersService
      .forceCreatePlayer(this.form.value)
      .subscribe(() => this.location.back());
  }
}
