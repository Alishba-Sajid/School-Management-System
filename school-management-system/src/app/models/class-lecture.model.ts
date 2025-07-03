export interface ClassLecture {
  id?: number;
  title: string;
  description?: string;
  date: string;
  subjectId: number;
  teacherId: number;

  subject?: {
    id: number;
    name: string;
  };

  teacher?: {
    id: number;
    fullName: string;
  };
}
