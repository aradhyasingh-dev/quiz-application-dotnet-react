// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using QuizApi.Models;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;

// namespace QuizApi.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class ParticipantController : ControllerBase
//     {
//         private readonly QuizDbContext _context;

//         public ParticipantController(QuizDbContext context)
//         {
//             _context = context;
//         }

//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<Participant>>> GetParticipants()
//         {
//             return await _context.Participants.ToListAsync();
//         }

//         [HttpGet("{id}")]
//         public async Task<ActionResult<Participant>> GetParticipant(int id)
//         {
//             var participant = await _context.Participants.FindAsync(id);

//             if (participant == null)
//                 return NotFound();

//             return participant;
//         }

//         [HttpPost]
//         public async Task<ActionResult<Participant>> PostParticipant(Participant participant)
//         {
//             var existingParticipant = await _context.Participants
//                 .FirstOrDefaultAsync(x =>
//                     x.Name == participant.Name &&
//                     x.Email == participant.Email);

//             if (existingParticipant != null)
//                 return Ok(existingParticipant);

//             _context.Participants.Add(participant);
//             await _context.SaveChangesAsync();

//             return CreatedAtAction(
//                 nameof(GetParticipant),
//                 new { id = participant.ParticipantId },
//                 participant
//             );
//         }

//         // ✅ FIXED PUT
//         [HttpPut("{id}")]
//         public async Task<IActionResult> PutParticipant(int id, ParticipantResult result)
//         {
//             if (id != result.ParticipantId)
//                 return BadRequest();

//             var participant = await _context.Participants.FindAsync(id);

//             if (participant == null)
//                 return NotFound();

//             participant.Score = result.Score;
//             participant.TimeTaken = result.TimeTaken;

//             await _context.SaveChangesAsync();

//             return NoContent();
//         }

//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteParticipant(int id)
//         {
//             var participant = await _context.Participants.FindAsync(id);

//             if (participant == null)
//                 return NotFound();

//             _context.Participants.Remove(participant);
//             await _context.SaveChangesAsync();

//             return NoContent();
//         }
//     }
// }
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApi.Models;

namespace QuizApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParticipantController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public ParticipantController(QuizDbContext context)
        {
            _context = context;
        }

        // =====================================
        // GET: api/Participant
        // Get All Participants
        // =====================================
        [HttpGet]
        public async Task<IActionResult> GetParticipants()
        {
            var participants = await _context.Participants
                .AsNoTracking()
                .ToListAsync();

            return Ok(participants);
        }

        // =====================================
        // GET: api/Participant/5
        // =====================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetParticipant(int id)
        {
            var participant = await _context.Participants
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ParticipantId == id);

            if (participant == null)
                return NotFound(new { message = "Participant not found" });

            return Ok(participant);
        }

        // =====================================
        // POST: api/Participant
        // Create or Return Existing Participant
        // =====================================
        [HttpPost]
        public async Task<IActionResult> PostParticipant([FromBody] Participant participant)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if already exists (by Email)
            var existingParticipant = await _context.Participants
                .FirstOrDefaultAsync(x => x.Email == participant.Email);

            if (existingParticipant != null)
                return Ok(existingParticipant);

            await _context.Participants.AddAsync(participant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetParticipant),
                new { id = participant.ParticipantId },
                participant
            );
        }


      // =====================================
        // PUT: api/Participant/5
        // Update Score & TimeTaken
        // =====================================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParticipant(int id, [FromBody] ParticipantResult result)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Optional safety check
            if (id != result.ParticipantId)
                return BadRequest(new { message = "Participant ID mismatch" });

            var participant = await _context.Participants.FindAsync(id);

            if (participant == null)
                return NotFound(new { message = "Participant not found" });

            // Update only score & time
            participant.Score = result.Score;
            participant.TimeTaken = result.TimeTaken;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        // =====================================
        // DELETE: api/Participant/5
        // =====================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipant(int id)
        {
            var participant = await _context.Participants.FindAsync(id);

            if (participant == null)
                return NotFound(new { message = "Participant not found" });

            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}