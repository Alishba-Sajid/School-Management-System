// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const appRoutes: Routes = [

    {
    path: '',
    loadComponent: () =>
      import('./components/home').then(m => m.HomeComponent)
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./components/students/students.component').then(m => m.StudentComponent)
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./components/teachers/teachers.component').then(m => m.TeacherComponent)
  },
  {
    path: 'subjects',
    loadComponent: () =>
      import('./components/subjects/subjects.component').then(m => m.SubjectComponent)
  },
  {
    path: 'class-lectures',
    loadComponent: () =>
      import('./components/class-lectures/class-lectures.component').then(m => m.ClassLecturesComponent)
  },
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./components/enrollments/enrollments.component').then(m => m.EnrollmentComponent)
  },
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: '**', redirectTo: '/students' }
];
