import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from 'moment';
import { Course } from "../model/course";
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CoursesStore } from '../services/courses.store';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  // We add the provider here to share this service with the MatDialogRef and be able tho call the loader when some action is triggered
  providers: [
    LoadingService,
    MessagesService
  ]
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesStore: CoursesStore,
    private messagesService: MessagesService) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngAfterViewInit() {

  }

  save() {

    const changes = this.form.value;
    // creating a new observable to call the loadingService.showLoaderUntilCompleted method
    this.coursesStore.updateCourse(this.course.id, changes)
    /* .pipe(
        catchError(err => {
          const errorMessage = "course could not be saved";
          console.log(errorMessage, err);
          this.messagesService.showErrors(errorMessage);
          return throwError(err);
        })
      )*/
      .subscribe();

      this.dialogRef.close(changes);

  }

  close() {
    this.dialogRef.close();
  }

}
