import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './teachers.html',
  styleUrls: ['./teachers.css']
})
export class TeacherComponent implements OnInit {
  teacherForm!: FormGroup;
  teachers: Teacher[] = [];
  isEditMode = false;
  selectedTeacherId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private toastr: ToastrService // ✅ Inject Toastr
  ) {}

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });

    this.loadTeachers();
  }

  loadTeachers() {
    this.isLoading = true;
    this.teacherService.getTeachers().subscribe({
      next: data => {
        this.teachers = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load teachers', err);
        this.toastr.error('Failed to load teachers');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.teacherForm.invalid) return;

    this.isLoading = true;
    const teacher = this.teacherForm.value;

    const handleError = (err: any) => {
      this.isLoading = false;
      if (err.status === 400 && err.error?.errors) {
        this.mapBackendErrors(err.error.errors);
      } else {
        console.error('Unexpected error', err);
        this.toastr.error('An unexpected error occurred');
      }
    };

    if (this.isEditMode && this.selectedTeacherId !== null) {
      this.teacherService.updateTeacher(this.selectedTeacherId, {
        id: this.selectedTeacherId,
        ...teacher
      }).subscribe({
        next: () => {
          this.toastr.success('Teacher updated successfully');
          this.loadTeachers();
          this.resetForm();
        },
        error: handleError
      });
    } else {
      this.teacherService.addTeacher(teacher).subscribe({
        next: () => {
          this.toastr.success('Teacher added successfully');
          this.loadTeachers();
          this.resetForm();
        },
        error: handleError
      });
    }
  }

  editTeacher(t: Teacher) {
    this.teacherForm.patchValue(t);
    this.selectedTeacherId = t.id;
    this.isEditMode = true;
  }

  deleteTeacher(id: number) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.isLoading = true;
      this.teacherService.deleteTeacher(id).subscribe({
        next: () => {
          this.toastr.success('Teacher deleted successfully');
          this.loadTeachers();
        },
        error: err => {
          console.error('Failed to delete teacher', err);
          this.toastr.error('Failed to delete teacher');
          this.isLoading = false;
        }
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.teacherForm.reset();
    this.isEditMode = false;
    this.selectedTeacherId = null;
  }

  mapBackendErrors(errors: { [key: string]: string[] }) {
    for (const key in errors) {
      const control = this.teacherForm.get(this.toCamelCase(key));
      if (control) {
        control.setErrors({ backend: errors[key][0] });
      }
    }
  }

  toCamelCase(key: string): string {
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
}
