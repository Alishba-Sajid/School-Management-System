import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'https://localhost:7001/api/enrollments';  // Your API base URL

  constructor(private http: HttpClient) {}

  // Update this method
  addEnrollment(enrollment: { studentId: number; classLectureId: number }): Observable<any> {
    return this.http.post(this.apiUrl, enrollment);
  }

  getEnrollments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteEnrollment(studentId: number, classLectureId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${studentId}/${classLectureId}`);
  }
}
