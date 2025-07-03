using System.ComponentModel.DataAnnotations;

namespace SchoolAPI.Models
{
    public class Subject
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Subject name is required.")]
        [StringLength(100, ErrorMessage = "Subject name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Subject code is required.")]
        [StringLength(10, ErrorMessage = "Subject code cannot exceed 10 characters.")]
        public string Code { get; set; } = string.Empty;

        public ICollection<ClassLecture>? ClassLectures { get; set; }
    }
}
