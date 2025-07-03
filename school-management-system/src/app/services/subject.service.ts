import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subject {
  id: number;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'https://localhost:7001/api/subjects'; // ✅ Use your backend port

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  addSubject(subject: Omit<Subject, 'id'>): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, subject);
  }

  updateSubject(id: number, subject: Subject): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, subject);
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
