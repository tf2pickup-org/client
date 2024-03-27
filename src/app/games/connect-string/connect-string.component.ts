import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { intervalToDuration, isAfter } from 'date-fns';
import { BehaviorSubject, map, Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-connect-string',
  templateUrl: './connect-string.component.html',
  styleUrls: ['./connect-string.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectStringComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();

  connectSecondsLeft = new BehaviorSubject<string>(null);

  @Input()
  connectString: string;

  @Input()
  stvConnectString: string;

  @Input()
  connectTimeout: Date;

  ngOnInit() {
    timer(0, 1000)
      .pipe(
        takeUntil(this.destroyed),
        map(() => this.connectTimeout),
        map(timeout =>
          timeout && isAfter(timeout, new Date())
            ? intervalToDuration({ start: new Date(), end: timeout })
            : null,
        ),
        map(duration =>
          duration
            ? [
                duration.minutes,
                duration.seconds?.toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                }) ?? '00',
              ].join(':')
            : null,
        ),
      )
      .subscribe(text => this.connectSecondsLeft.next(text));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
