import { Pipe, PipeTransform } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';

interface ObservableWithStatus<T> {
  loading: boolean;
  value?: T;
  error?: unknown;
}

@Pipe({
  name: 'withLoading',
})
export class WithLoadingPipe implements PipeTransform {
  transform<T>(value: Observable<T>): Observable<ObservableWithStatus<T>> {
    return value.pipe(
      map(value => ({ loading: false, value })),
      startWith({ loading: true }),
      catchError((error: unknown) => of({ loading: false, error })),
    );
  }
}
