import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MDCTextField } from '@material/textfield/component';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { addGameServer, gameServerAdded } from '../game-servers.actions';
import { GameServer } from '../models/game-server';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-game-server',
  templateUrl: './add-game-server.component.html',
  styleUrls: ['./add-game-server.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGameServerComponent implements AfterViewInit, OnDestroy {

  gameServer = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    port: ['27015', [Validators.min(0), Validators.max(65535)]],
    rconPassword: ['', Validators.required],
  });

  locked = new BehaviorSubject<boolean>(false);

  @ViewChild('name')
  nameInput: ElementRef;

  @ViewChild('address')
  addressInput: ElementRef;

  @ViewChild('port')
  portInput: ElementRef;

  @ViewChild('rconPassword')
  rconPasswordInput: ElementRef;

  @HostListener('document:keydown.escape', ['$event'])
  onKeyDown() {
    this.cancel();
  }

  private fields: MDCTextField[];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private actions: Actions,
    private location: Location,
  ) { }

  ngAfterViewInit() {
    this.fields = [
      this.nameInput,
      this.addressInput,
      this.portInput,
      this.rconPasswordInput,
    ].map(input => new MDCTextField(input.nativeElement));
  }

  ngOnDestroy() {
    this.fields.forEach(field => field.destroy());
  }

  add() {
    if (this.gameServer.valid) {
      this.locked.next(true);

      const gameServer: GameServer = {
        ...this.gameServer.value,
        port: `${this.gameServer.value.port}`,
      };

      this.actions.pipe(
        ofType(gameServerAdded),
        first(action => action.gameServer.name === gameServer.name),
      ).subscribe(() => this.router.navigate(['/servers']));

      this.store.dispatch(addGameServer({ gameServer }));
    }
  }

  cancel() {
    this.location.back();
  }

}
