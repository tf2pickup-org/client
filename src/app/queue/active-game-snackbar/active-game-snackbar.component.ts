import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { Game } from '@app/games/models/game';
import { MDCSnackbar } from '@material/snackbar';

@Component({
  selector: 'app-active-game-snackbar',
  templateUrl: './active-game-snackbar.component.html',
  styleUrls: ['./active-game-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveGameSnackbarComponent implements AfterViewChecked, OnDestroy {

  @Input()
  gameId: string;

  @ViewChild('container')
  container: ElementRef;

  private snackbar?: MDCSnackbar;

  ngAfterViewChecked() {
    if (this.gameId && this.container) {
      this.createSnackbar();
    }
  }

  ngOnDestroy() {
    if (this.snackbar) {
      this.snackbar.destroy();
    }
  }

  private createSnackbar() {
    if (this.snackbar) {
      this.snackbar.destroy();
    }

    this.snackbar = new MDCSnackbar(this.container.nativeElement);
    this.snackbar.timeoutMs = -1;
    this.snackbar.open();
  }

}
