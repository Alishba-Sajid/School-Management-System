import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  fullName: string;
  age: number;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'https://localhost:7001/api/students'; // ✅ Replace with actual port if different

  constructor(private http: HttpClient) {}

  // ✅ GET all students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // ✅ POST: Add new student
  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  // ✅ PUT: Update student
  updateStudent(id: number, student: Student): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, student);
  }

  // ✅ DELETE: Remove student
  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
