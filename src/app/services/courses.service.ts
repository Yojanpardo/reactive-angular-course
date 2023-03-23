import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay, tap } from "rxjs/operators";
import { Lesson } from "../model/lesson";
import { LoadingService } from "../loading/loading.service";

/*
 * This is an obserbable state servise which doesn't have
 * access to application data nor saves data in memory
 */
@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private subject = new BehaviorSubject<Lesson[]>([]);
  private lessons$ = this.subject.asObservable();

  constructor(private http:HttpClient, private loadingService: LoadingService){

  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]>{
    return this.http.get<Lesson[]>(`/api/lessons`, {
      params: {
        pageSize: "10000",
        courseId: courseId.toString()
      }
    }).pipe(
      map(res => res["payload"]),
      shareReplay()
    )
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses')
      .pipe(
        // use the rxjs map operator to transform the data into some thing that matches with the returning type
        map(res => res["payload"]),
        // use this method to avoid a http request for each subscription
        // with this operator the service will create only a http request an then will share the first response
        // every time that get a subscription after the first call
        shareReplay()
      );
  }

  updateCourse(courseId: string | number, changes: Partial<Course>): Observable<any>{
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      shareReplay()
    );
  }

  searchLessons(search: string): Observable<Lesson[]>{

    const loadLessons$ = this.http.get<Lesson[]>('/api/lessons', {
      params: {
        filter: search,
        pageSize: "100"
      }
    }).pipe(
      map(res => res["payload"]),
      tap(lessons => this.subject.next(lessons)),
      shareReplay()
    );

    this.loadingService.showLoaderUntilCompleted(loadLessons$).subscribe();

    return loadLessons$;
  }

  getCourse(courseId: number): Observable<Course>{
    const findCourse$ = this.http.get<Course>(`/api/courses/${courseId}`).pipe(
      shareReplay()
    );

    this.loadingService.showLoaderUntilCompleted(findCourse$).subscribe();

    return findCourse$;
  }

}
