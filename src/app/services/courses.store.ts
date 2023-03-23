import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

/*
 * This is a singleton class shared across the application.
 * state full, should have an state
 * global service, the data should be the same in the whole application
*/
@Injectable({
  providedIn: 'root'
})
export class CoursesStore {

  // the behavior subject has the capability to remember the las value used
  // we can take advantage of this for update the view more fluently
  private subject = new BehaviorSubject<Course[]>([]);

  courses$ = this.subject.asObservable();

  constructor(private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService) {

      this.getAllCourses();

  }


  private getAllCourses(): Observable<Course[]> {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        // use the rxjs map operator to transform the data into some thing that matches with the returning type
        map(res => res["payload"]),
        // use this method to avoid a http request for each subscription
        // with this operator the service will create only a http request an then will share the first response
        // every time that get a subscription after the first call
        // shareReplay(),
        catchError(err => {
          const message = "Could not load courses";
          console.error(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        tap(courses => this.subject.next(courses))
      );

      this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();

      return loadCourses$;
  }

  /* in this method we return an observable of any only
   * to perform actions when the update method is executed successfully
   */
  updateCourse(courseId: string | number, changes: Partial<Course>): Observable<any> {

    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes
    }
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError(err => {
        const message = "Could not update course";
        console.error(message, err);
        this.messagesService.showErrors(message);
        return throwError(err)
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === category)
        .sort(sortCoursesBySeqNo))
    )
  }
}
