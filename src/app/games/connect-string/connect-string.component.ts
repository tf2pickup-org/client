import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  formatDistanceToNowStrict,
  formatDuration,
  intervalToDuration,
  isAfter,
  isBefore,
} from 'date-fns';
import { BehaviorSubject, filter, map, Subject, takeUntil, timer } from 'rxjs';
@Component({
  selector: 'app-connect-string',
  templateUrl: './connect-string.component.html',
  styleUrls: ['./connect-string.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectStringComponent implements OnDestroy {
  private destroyed = new Subject<void>();

  connectSecondsLeft = new BehaviorSubject<string>(null);

  @Input()
  connectString: string;

  @Input()
  stvConnectString: string;

  @Input()
  set connectTimeout(connectTimeout: Date) {
    if (connectTimeout) {
      timer(0, 1000)
        .pipe(
          takeUntil(this.destroyed),
          map(() => connectTimeout),
          map(timeout =>
            timeout && isAfter(timeout, new Date())
              ? intervalToDuration({ start: timeout, end: new Date() })
              : null,
          ),
          map(duration =>
            duration
              ? [
                  duration.minutes,
                  duration.seconds.toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                  }),
                ].join(':')
              : null,
          ),
        )
        .subscribe(text => this.connectSecondsLeft.next(text));
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
