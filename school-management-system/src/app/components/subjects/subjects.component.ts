import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr import

@Component({
  selector: 'app-subject',
  standalone: true,
  templateUrl: './subjects.html',
  styleUrls: ['./subjects.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingSpinnerComponent
  ]
})
export class SubjectComponent implements OnInit {
  subjectForm!: FormGroup;
  subjects: Subject[] = [];
  isEditMode = false;
  editingSubjectId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private toastr: ToastrService // ✅ Inject toastr
  ) {}

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.loadSubjects();
  }

  loadSubjects() {
    this.isLoading = true;
    this.subjectService.getSubjects().subscribe({
      next: data => {
        this.subjects = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load subjects', err);
        this.toastr.error('Failed to load subjects');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.subjectForm.invalid) return;

    const subject = this.subjectForm.value;
    this.isLoading = true;

    const handleError = (err: any) => {
      this.isLoading = false;
      if (err.status === 400 && err.error?.errors) {
        this.mapBackendErrors(err.error.errors);
      } else {
        console.error('Unexpected error', err);
        this.toastr.error('An error occurred');
      }
    };

    if (this.isEditMode && this.editingSubjectId !== null) {
      this.subjectService.updateSubject(this.editingSubjectId, {
        id: this.editingSubjectId,
        ...subject
      }).subscribe({
        next: () => {
          this.toastr.success('Subject updated successfully');
          this.loadSubjects();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: handleError
      });
    } else {
      this.subjectService.addSubject(subject).subscribe({
        next: () => {
          this.toastr.success('Subject added successfully');
          this.loadSubjects();
          this.subjectForm.reset();
          this.isLoading = false;
        },
        error: handleError
      });
    }
  }

  editSubject(sub: Subject) {
    this.subjectForm.patchValue(sub);
    this.editingSubjectId = sub.id;
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingSubjectId = null;
    this.subjectForm.reset();
  }

  deleteSubject(id: number) {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.isLoading = true;
      this.subjectService.deleteSubject(id).subscribe({
        next: () => {
          this.toastr.success('Subject deleted successfully');
          this.loadSubjects();
          this.isLoading = false;
        },
        error: err => {
          console.error('Failed to delete subject', err);
          this.toastr.error('Failed to delete subject');
          this.isLoading = false;
        }
      });
    }
  }

  mapBackendErrors(errors: { [key: string]: string[] }) {
    for (const key in errors) {
      const control = this.subjectForm.get(this.toCamelCase(key));
      if (control) {
        control.setErrors({ backend: errors[key][0] });
      }
    }
  }

  toCamelCase(key: string): string {
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
}
