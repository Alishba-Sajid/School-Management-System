import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassLecture } from '../models/class-lecture.model';

@Injectable({
  providedIn: 'root'
})
export class ClassLectureService {
  private apiUrl = 'https://localhost:7001/api/ClassLectures';

  constructor(private http: HttpClient) {}

  getLectures(): Observable<ClassLecture[]> {
    return this.http.get<ClassLecture[]>(this.apiUrl);
  }

  addLecture(lecture: Omit<ClassLecture, 'id'>): Observable<ClassLecture> {
    return this.http.post<ClassLecture>(this.apiUrl, lecture);
  }

  updateLecture(id: number, lecture: ClassLecture): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, lecture);
  }

  deleteLecture(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
