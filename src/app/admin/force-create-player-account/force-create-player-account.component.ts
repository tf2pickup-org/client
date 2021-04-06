import { Location } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PlayersService } from '@app/players/players.service';
import { MDCTextField } from '@material/textfield';

@Component({
  selector: 'app-force-create-player-account',
  templateUrl: './force-create-player-account.component.html',
  styleUrls: ['./force-create-player-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForceCreatePlayerAccountComponent
  implements AfterViewInit, OnDestroy {
  form = this.formBuilder.group({
    name: ['', Validators.required],
    steamId: ['', [Validators.required, Validators.pattern(/^\d{17}$/)]],
  });

  @ViewChild('name')
  nameInput: ElementRef;

  @ViewChild('steamId')
  steamIdInput: ElementRef;

  private fields: MDCTextField[];

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

  ngAfterViewInit() {
    this.fields = [this.nameInput, this.steamIdInput].map(
      input => new MDCTextField(input.nativeElement),
    );

    setTimeout(() => this.nameInput.nativeElement.focus(), 0);
  }

  ngOnDestroy() {
    this.fields.forEach(field => field.destroy());
  }
}
