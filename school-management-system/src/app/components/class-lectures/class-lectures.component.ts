import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ClassLectureService } from '../../services/class-lecture.service';
import { SubjectService, Subject } from '../../services/subject.service';
import { TeacherService, Teacher } from '../../services/teacher.service';
import { ClassLecture } from '../../models/class-lecture.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-class-lecture',
  standalone: true,
  templateUrl: './class-lectures.html',
  styleUrls: ['./class-lectures.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingSpinnerComponent
  ]
})
export class ClassLecturesComponent implements OnInit {
  lectureForm!: FormGroup;
  lectures: ClassLecture[] = [];
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  isEditMode = false;
  editingId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private classLectureService: ClassLectureService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private toastr: ToastrService // ✅ Inject Toastr
  ) {}

  ngOnInit(): void {
    this.lectureForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      subjectId: [null, Validators.required],
      teacherId: [null, Validators.required]
    });

    this.loadLectures();
    this.loadTeachers();
    this.loadSubjects();
  }

  loadLectures(): void {
    this.isLoading = true;
    this.classLectureService.getLectures().subscribe({
      next: data => {
        this.lectures = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load lectures', err);
        this.toastr.error('Failed to load lectures');
        this.isLoading = false;
      }
    });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: data => this.teachers = data,
      error: err => {
        console.error('Failed to load teachers', err);
        this.toastr.error('Failed to load teachers');
      }
    });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => {
        console.error('Failed to load subjects', err);
        this.toastr.error('Failed to load subjects');
      }
    });
  }

  onSubmit(): void {
    if (this.lectureForm.invalid) return;

    const lectureData: Omit<ClassLecture, 'id'> = this.lectureForm.value;
    this.isLoading = true;

    const handleError = (err: any) => {
      this.isLoading = false;
      if (err.status === 400 && err.error?.errors) {
        this.mapBackendErrors(err.error.errors);
      } else {
        console.error('Unexpected error', err);
        this.toastr.error('An unexpected error occurred.');
      }
    };

    if (this.isEditMode && this.editingId !== null) {
      const updateData: ClassLecture = { id: this.editingId, ...lectureData };
      this.classLectureService.updateLecture(this.editingId, updateData).subscribe({
        next: () => {
          this.toastr.success('Lecture updated successfully!');
          this.loadLectures();
          this.resetForm();
          this.isLoading = false;
        },
        error: handleError
      });
    } else {
      this.classLectureService.addLecture(lectureData).subscribe({
        next: () => {
          this.toastr.success('Lecture added successfully!');
          this.loadLectures();
          this.resetForm();
          this.isLoading = false;
        },
        error: handleError
      });
    }
  }

  editLecture(lecture: ClassLecture): void {
    this.lectureForm.patchValue({
      title: lecture.title,
      description: lecture.description,
      date: lecture.date,
      subjectId: lecture.subjectId,
      teacherId: lecture.teacherId
    });

    this.editingId = lecture.id ?? null;
    this.isEditMode = true;
  }

  deleteLecture(id?: number): void {
    if (!id) return;
    if (confirm('Delete this class lecture?')) {
      this.isLoading = true;
      this.classLectureService.deleteLecture(id).subscribe({
        next: () => {
          this.toastr.success('Lecture deleted successfully!');
          this.loadLectures();
          this.isLoading = false;
        },
        error: err => {
          console.error('Delete failed', err);
          this.toastr.error('Failed to delete lecture');
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.lectureForm.reset();
    this.isEditMode = false;
    this.editingId = null;
  }

  mapBackendErrors(errors: { [key: string]: string[] }) {
    for (const key in errors) {
      const control = this.lectureForm.get(this.toCamelCase(key));
      if (control) {
        control.setErrors({ backend: errors[key][0] });
      }
    }
  }

  toCamelCase(key: string): string {
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
}
