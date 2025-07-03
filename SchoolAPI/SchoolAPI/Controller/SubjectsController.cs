using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAPI.Data;
using SchoolAPI.Models;

namespace SchoolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubjectsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Subjects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
        {
            try
            {
                var subjects = await _context.Subjects.ToListAsync();
                return Ok(subjects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving subjects.", details = ex.Message });
            }
        }

        // ✅ GET: api/Subjects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Subject>> GetSubject(int id)
        {
            try
            {
                var subject = await _context.Subjects.FindAsync(id);

                if (subject == null)
                    return NotFound(new { message = $"Subject with ID {id} not found." });

                return Ok(subject);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving subject.", details = ex.Message });
            }
        }

        // ✅ POST: api/Subjects
        [HttpPost]
        public async Task<ActionResult<Subject>> PostSubject([FromBody] Subject subject)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // ✅ Required for validation to work

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subject);
        }

        // ✅ PUT: api/Subjects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubject(int id, [FromBody] Subject subject)
        {
            if (id != subject.Id)
                return BadRequest(new { message = "ID in URL does not match ID in body." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _context.Subjects.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = $"Subject with ID {id} not found." });

                // ✅ FIX: update all fields
                existing.Name = subject.Name;
                existing.Code = subject.Code;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating subject.", details = ex.Message });
            }
        }
        // ✅ DELETE: api/Subjects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            try
            {
                var subject = await _context.Subjects.FindAsync(id);
                if (subject == null)
                    return NotFound(new { message = $"Subject with ID {id} not found." });

                _context.Subjects.Remove(subject);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Subject deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting subject.", details = ex.Message });
            }
        }
    }
}
