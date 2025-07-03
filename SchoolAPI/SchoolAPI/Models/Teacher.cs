using System.ComponentModel.DataAnnotations;

namespace SchoolAPI.Models
{
    public class Teacher
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(100, ErrorMessage = "Full Name cannot exceed 100 characters.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department is required.")]
        [StringLength(50, ErrorMessage = "Department name is too long.")]
        public string Department { get; set; } = string.Empty;

        public ICollection<ClassLecture>? ClassLectures { get; set; }
    }
}
