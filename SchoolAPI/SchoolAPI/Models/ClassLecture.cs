using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAPI.Models
{
    public class ClassLecture
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title must not exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description can't exceed 500 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date is required.")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Subject selection is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Subject selection is required.")]
        public int? SubjectId { get; set; }
        public Subject? Subject { get; set; }

        [Required(ErrorMessage = "Teacher selection is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Teacher selection is required.")]
        public int? TeacherId { get; set; }
        public Teacher? Teacher { get; set; }

        public ICollection<Enrollment>? Enrollments { get; set; }
    }
}
