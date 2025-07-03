using SchoolAPI.Models;
public class Enrollment
{
    public int StudentId { get; set; }
    public Student? Student { get; set; }  // nullable

    public int ClassLectureId { get; set; }
    public ClassLecture? ClassLecture { get; set; }  // nullable
}

