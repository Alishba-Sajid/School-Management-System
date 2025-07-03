using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAPI.Data;
using SchoolAPI.DTO;
using SchoolAPI.Models;

namespace SchoolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EnrollmentsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET all enrollments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments()
        {
            try
            {
                var enrollments = await _context.Enrollments
                    .Include(e => e.Student)
                    .Include(e => e.ClassLecture)
                        .ThenInclude(cl => cl.Subject)
                    .Include(e => e.ClassLecture)
                        .ThenInclude(cl => cl.Teacher)
                    .ToListAsync();

                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving enrollments.", details = ex.Message });
            }
        }

        // ✅ GET specific enrollment
        [HttpGet("{studentId}/{classLectureId}")]
        public async Task<ActionResult<Enrollment>> GetEnrollment(int studentId, int classLectureId)
        {
            try
            {
                var enrollment = await _context.Enrollments
                    .Include(e => e.Student)
                    .Include(e => e.ClassLecture)
                    .FirstOrDefaultAsync(e => e.StudentId == studentId && e.ClassLectureId == classLectureId);

                if (enrollment == null)
                    return NotFound(new { message = "Enrollment not found." });

                return Ok(enrollment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving enrollment.", details = ex.Message });
            }
        }

        // ✅ POST: Enroll student using DTO
        [HttpPost]
        public async Task<ActionResult<Enrollment>> EnrollStudent([FromBody] EnrollmentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.ClassLectureId == dto.ClassLectureId && e.StudentId == dto.StudentId);

                if (existing != null)
                    return Conflict(new { message = "Student is already enrolled in this class." });

                var enrollment = new Enrollment
                {
                    StudentId = dto.StudentId,
                    ClassLectureId = dto.ClassLectureId
                };

                _context.Enrollments.Add(enrollment);
                await _context.SaveChangesAsync();

                var created = await _context.Enrollments
                    .Include(e => e.Student)
                    .Include(e => e.ClassLecture)
                        .ThenInclude(cl => cl.Subject)
                    .Include(e => e.ClassLecture)
                        .ThenInclude(cl => cl.Teacher)
                    .FirstOrDefaultAsync(e => e.StudentId == enrollment.StudentId && e.ClassLectureId == enrollment.ClassLectureId);

                return CreatedAtAction(nameof(GetEnrollment), new { studentId = enrollment.StudentId, classLectureId = enrollment.ClassLectureId }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error enrolling student.", details = ex.Message });
            }
        }

        // ✅ DELETE enrollment
        [HttpDelete("{studentId}/{classLectureId}")]
        public async Task<IActionResult> DeleteEnrollment(int studentId, int classLectureId)
        {
            try
            {
                var enrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.StudentId == studentId && e.ClassLectureId == classLectureId);

                if (enrollment == null)
                    return NotFound(new { message = "Enrollment not found." });

                _context.Enrollments.Remove(enrollment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Enrollment deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting enrollment.", details = ex.Message });
            }
        }
    }
}
