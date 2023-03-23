import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {

  // the default behavior of our loader
  private loadingSubject = new BehaviorSubject<boolean>(false);

  //the observable which emits the boolean variable that indicates if the loader should be displayed or not
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.loadingOn()),
        // whit this operator we concat the obs$ to the actual observable which is null, and finally return only the obs$
        concatMap(() => obs$),
        // when the obs$ parameter stops to emit any value the finalize operator is called in order to stop the loader
        finalize(() => this.loadingOff())
      )
  }

  private loadingOn(){
    this.loadingSubject.next(true);
  }

  private loadingOff(){
    this.loadingSubject.next(false);
  }
}
