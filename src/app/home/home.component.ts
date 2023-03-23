import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesStore: CoursesStore
  ) {
  }

  ngOnInit() {
    this.reloadCourses();
  }


  reloadCourses() {

    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");
    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");

    /*  the old code
        As a good practice we add a dollar symbol ($) at the end
        of a variable to quickly identify that it is an observable

        const courses$ = this.coursesService.getAllCourses().pipe(
          map(courses => courses.sort(sortCoursesBySeqNo)),
          catchError(err => {
            const message = "could not load courses";
            this.messagesService.showErrors(message);
            console.log(message, err);
            return throwError(err);
          })
        );

        const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    */

  }
}




