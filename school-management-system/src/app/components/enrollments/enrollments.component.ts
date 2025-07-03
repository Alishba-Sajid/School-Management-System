import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService, Student } from '../../services/student.service';
import { ClassLectureService } from '../../services/class-lecture.service';
import { ClassLecture } from '../../models/class-lecture.model';
import { Enrollment } from '../../models/enrollment.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr import

@Component({
  selector: 'app-enrollment',
  standalone: true,
  templateUrl: './enrollments.html',
  styleUrls: ['./enrollments.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingSpinnerComponent
  ]
})
export class EnrollmentComponent implements OnInit {
  enrollForm!: FormGroup;
  students: Student[] = [];
  lectures: ClassLecture[] = [];
  enrollments: Enrollment[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private classLectureService: ClassLectureService,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.enrollForm = this.fb.group({
      studentId: [null, Validators.required],
      classLectureId: [null, Validators.required]
    });

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;

    Promise.all([
      this.studentService.getStudents().toPromise(),
      this.classLectureService.getLectures().toPromise(),
      this.enrollmentService.getEnrollments().toPromise()
    ])
      .then(([students, lectures, enrollments]) => {
        this.students = students as Student[];
        this.lectures = lectures as ClassLecture[];
        this.enrollments = enrollments;
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Failed to load initial data', err);
        this.toastr.error('Failed to load initial data');
        this.isLoading = false;
      });
  }

  onSubmit(): void {
    if (this.enrollForm.invalid) return;

    this.isLoading = true;
    const data = this.enrollForm.value;

    this.enrollmentService.addEnrollment(data).subscribe({
      next: () => {
        this.toastr.success('Enrollment successful!');
        this.loadEnrollments();
        this.enrollForm.reset();
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 400 && err.error?.errors) {
          this.mapBackendErrors(err.error.errors);
        } else {
          console.error('Unexpected error', err);
          this.toastr.error('Failed to enroll student.');
        }
      }
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getEnrollments().subscribe({
      next: data => {
        this.enrollments = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load enrollments', err);
        this.toastr.error('Failed to load enrollments');
        this.isLoading = false;
      }
    });
  }

  deleteEnrollment(studentId: number, classLectureId: number): void {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;

    this.isLoading = true;
    this.enrollmentService.deleteEnrollment(studentId, classLectureId).subscribe({
      next: () => {
        this.toastr.success('Enrollment deleted successfully');
        this.loadEnrollments();
      },
      error: err => {
        console.error('Failed to delete enrollment', err);
        this.toastr.error('Failed to delete enrollment');
        this.isLoading = false;
      }
    });
  }

  mapBackendErrors(errors: { [key: string]: string[] }) {
    for (const key in errors) {
      const control = this.enrollForm.get(this.toCamelCase(key));
      if (control) {
        control.setErrors({ backend: errors[key][0] });
      }
    }
  }

  toCamelCase(key: string): string {
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
}
