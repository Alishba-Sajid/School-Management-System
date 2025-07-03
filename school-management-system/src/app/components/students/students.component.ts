import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { StudentService, Student } from '../../services/student.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ToastrService } from 'ngx-toastr'; 
@Component({
  selector: 'app-student',
  standalone: true,
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingSpinnerComponent
  ]
})
export class StudentComponent implements OnInit {
  studentForm!: FormGroup;
  students: Student[] = [];
  isEditMode = false;
  editingStudentId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(3), Validators.max(18)]],
      gender: ['', Validators.required]
    });

    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.toastr.error('Failed to load students');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.studentForm.invalid) return;

    const student = this.studentForm.value;
    this.isLoading = true;

    const handleError = (err: any) => {
      this.isLoading = false;
      if (err.status === 400 && err.error?.errors) {
        this.mapBackendErrors(err.error.errors);
      } else {
        console.error('Unexpected error', err);
        this.toastr.error('Something went wrong');
      }
    };

    if (this.isEditMode && this.editingStudentId !== null) {
      this.studentService.updateStudent(this.editingStudentId, {
        id: this.editingStudentId,
        ...student
      }).subscribe({
        next: () => {
          this.toastr.success('Student updated successfully');
          this.loadStudents();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: handleError
      });
    } else {
      this.studentService.addStudent(student).subscribe({
        next: () => {
          this.toastr.success('Student added successfully');
          this.loadStudents();
          this.studentForm.reset();
          this.isLoading = false;
        },
        error: handleError
      });
    }
  }
editStudent(s: Student) {
  console.log('Editing student:', s);
  this.studentForm.patchValue({
    fullName: s.fullName,
    age: s.age,
    gender: s.gender
  });
  this.editingStudentId = s.id;
  this.isEditMode = true;
}
  cancelEdit() {
    this.isEditMode = false;
    this.editingStudentId = null;
    this.studentForm.reset();
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.isLoading = true;
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.toastr.success('Student deleted successfully');
          this.loadStudents();
          this.isLoading = false;
        },
        error: () => {
          console.error('Error deleting student');
          this.toastr.error('Failed to delete student');
          this.isLoading = false;
        }
      });
    }
  }

  mapBackendErrors(errors: { [key: string]: string[] }) {
    for (const key in errors) {
      const control = this.studentForm.get(this.toCamelCase(key));
      if (control) {
        control.setErrors({ backend: errors[key][0] });
      }
    }
  }

  toCamelCase(key: string): string {
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
}
