import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 // ✅ Correct import

export interface Teacher {
  id: number;
  fullName: string;
  email: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'https://localhost:7001/api/teachers';

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  addTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher);
  }

  updateTeacher(id: number, teacher: Teacher): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, teacher);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
