using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAPI.Data;
using SchoolAPI.Models;

namespace SchoolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassLecturesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClassLecturesController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET all Class Lectures with Teacher & Subject
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassLecture>>> GetClassLectures()
        {
            try
            {
                var lectures = await _context.ClassLectures
                    .Include(cl => cl.Subject)
                    .Include(cl => cl.Teacher)
                    .ToListAsync();

                return Ok(lectures);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving class lectures.", details = ex.Message });
            }
        }

        // ✅ GET by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ClassLecture>> GetClassLecture(int id)
        {
            try
            {
                var classLecture = await _context.ClassLectures
                    .Include(cl => cl.Subject)
                    .Include(cl => cl.Teacher)
                    .FirstOrDefaultAsync(cl => cl.Id == id);

                if (classLecture == null)
                    return NotFound(new { message = $"ClassLecture with ID {id} not found." });

                return Ok(classLecture);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving class lecture.", details = ex.Message });
            }
        }

        // ✅ POST: Create new Class Lecture
        [HttpPost]
        public async Task<ActionResult<ClassLecture>> PostClassLecture([FromBody] ClassLecture classLecture)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // ✅ Required for validation to work

            _context.ClassLectures.Add(classLecture);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClassLecture), new { id = classLecture.Id }, classLecture);
        }


        // ✅ PUT: Update existing Class Lecture
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClassLecture(int id, [FromBody] ClassLecture classLecture)
        {
            if (id != classLecture.Id)
                return BadRequest(new { message = "ID in URL does not match body ID." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await _context.ClassLectures.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = $"ClassLecture with ID {id} not found." });

                existing.Title = classLecture.Title;
                existing.Description = classLecture.Description;
                existing.Date = classLecture.Date;
                existing.SubjectId = classLecture.SubjectId;
                existing.TeacherId = classLecture.TeacherId;

                await _context.SaveChangesAsync();
                return Ok(existing); // Optional: return updated entity
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating class lecture.", details = ex.Message });
            }
        }

        // ✅ DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassLecture(int id)
        {
            try
            {
                var classLecture = await _context.ClassLectures.FindAsync(id);
                if (classLecture == null)
                    return NotFound(new { message = $"ClassLecture with ID {id} not found." });

                _context.ClassLectures.Remove(classLecture);
                await _context.SaveChangesAsync();

                return Ok(new { message = "ClassLecture deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting class lecture.", details = ex.Message });
            }
        }
    }
}
