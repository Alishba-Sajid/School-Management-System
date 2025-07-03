export interface Student {
  id: number;
  fullName: string;
  age: number;
  gender: string;
}

export interface ClassLecture {
  id: number;
  title: string;
  schedule: string;
  subjectId: number;
  teacherId: number;
}

export interface Enrollment {
  studentId: number;
  classLectureId: number;
  student?: Student;
  classLecture?: ClassLecture;
}

export interface EnrollmentPayload {
  StudentId: number;
  ClassLectureId: number;
}
