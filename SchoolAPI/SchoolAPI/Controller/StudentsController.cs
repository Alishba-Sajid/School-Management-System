using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAPI.Data;
using SchoolAPI.Models;

namespace SchoolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            try
            {
                var students = await _context.Students.ToListAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving students.", details = ex.Message });
            }
        }

        // ✅ GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            try
            {
                var student = await _context.Students.FindAsync(id);

                if (student == null)
                    return NotFound(new { message = $"Student with ID {id} not found." });

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving student.", details = ex.Message });
            }
        }

        // ✅ POST: api/Students
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent([FromBody] Student student)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // 👈 This line enforces validation

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }


        // ✅ PUT: api/Students/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, [FromBody] Student student)
        {
            if (id != student.Id)
                return BadRequest(new { message = "ID in URL does not match ID in body." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _context.Students.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = $"Student with ID {id} not found." });

                // ✅ FIXED: Update all editable fields
                existing.FullName = student.FullName;
                existing.Age = student.Age;
                existing.Gender = student.Gender;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating student.", details = ex.Message });
            }
        }

        // ✅ DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                var student = await _context.Students.FindAsync(id);
                if (student == null)
                    return NotFound(new { message = $"Student with ID {id} not found." });

                _context.Students.Remove(student);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Student deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting student.", details = ex.Message });
            }
        }
    }
}
