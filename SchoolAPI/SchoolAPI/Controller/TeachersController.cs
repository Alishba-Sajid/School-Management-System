using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAPI.Data;
using SchoolAPI.Models;

namespace SchoolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            try
            {
                var teachers = await _context.Teachers.ToListAsync();
                return Ok(teachers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving teachers.", details = ex.Message });
            }
        }

        // ✅ GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            try
            {
                var teacher = await _context.Teachers.FindAsync(id);
                if (teacher == null)
                    return NotFound(new { message = $"Teacher with ID {id} not found." });

                return Ok(teacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving teacher.", details = ex.Message });
            }
        }

        // ✅ POST: api/Teachers
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher([FromBody] Teacher teacher)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _context.Teachers.Add(teacher);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, teacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating teacher.", details = ex.Message });
            }
        }

        // ✅ PUT: api/Teachers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, [FromBody] Teacher teacher)
        {
            if (id != teacher.Id)
                return BadRequest(new { message = "ID in URL does not match ID in body." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _context.Teachers.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = $"Teacher with ID {id} not found." });

                // Update fields
                existing.FullName = teacher.FullName;
                existing.Email = teacher.Email;
                existing.Department = teacher.Department;

                await _context.SaveChangesAsync();

                return Ok(existing); // Optional: return updated teacher
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating teacher.", details = ex.Message });
            }
        }

        // ✅ DELETE: api/Teachers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            try
            {
                var teacher = await _context.Teachers.FindAsync(id);
                if (teacher == null)
                    return NotFound(new { message = $"Teacher with ID {id} not found." });

                _context.Teachers.Remove(teacher);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Teacher deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting teacher.", details = ex.Message });
            }
        }
    }
}
