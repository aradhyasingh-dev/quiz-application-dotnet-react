// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using QuizApi.Models;

// namespace QuizApi.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class QuestionController : ControllerBase
//     {
//         private readonly QuizDbContext _context;

//         public QuestionController(QuizDbContext context)
//         {
//             _context = context;
//         }


//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<object>>> GetQuestions()
//         {
//             var allQns = await _context.Questions
//                 .Select(x => new
//                 {
//                     qnId = x.QnId,
//                     qnInWords = x.QnInWords,
//                     imageName = x.ImageName,
//                     options = new string[]
//                     {
//                 x.Option1,
//                 x.Option2,
//                 x.Option3,
//                 x.Option4
//                     }
//                 })
//                 .OrderBy(x => Guid.NewGuid()) // random order
//                 .ToListAsync();

//             return Ok(allQns);
//         }


//         [HttpGet("{id}")]
//         public async Task<ActionResult<Question>> GetQuestion(int id)
//         {
//             var question = await _context.Questions.FindAsync(id);

//             if (question == null)
//                 return NotFound();

//             return question;
//         }

//         // POST: api/Question/GetAnswer
//         [HttpPost("GetAnswer")]
//         public async Task<IActionResult> RetrieveAnswers([FromBody] int[] qnIds)
//         {
//             var answers = await _context.Questions
//                 .Where(x => qnIds.Contains(x.QnId))
//                 .Select(x => new
//                 {
//                     qnId = x.QnId,
//                     qnInWords = x.QnInWords,
//                     imageName = x.ImageName,
//                     options = new string[]
//                     {
//                         x.Option1,
//                         x.Option2,
//                         x.Option3,
//                         x.Option4
//                     },
//                     answer = x.Answer
//                 })
//                 .ToListAsync();

//             return Ok(answers);
//         }

//         // PUT: api/Question/5
//         [HttpPut("{id}")]
//         public async Task<IActionResult> PutQuestion(int id, Question question)
//         {
//             if (id != question.QnId)
//                 return BadRequest();

//             _context.Entry(question).State = EntityState.Modified;
//             await _context.SaveChangesAsync();

//             return NoContent();
//         }

//         // DELETE: api/Question/5
//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteQuestion(int id)
//         {
//             var question = await _context.Questions.FindAsync(id);

//             if (question == null)
//                 return NotFound();

//             _context.Questions.Remove(question);
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
    public class QuestionController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public QuestionController(QuizDbContext context)
        {
            _context = context;
        }

        // ============================
        // GET: api/Question
        // Get All Questions (Random Order - Without Answers)
        // ============================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestions()
        {
            var questions = await _context.Questions
                .AsNoTracking()
                .ToListAsync();

            var randomized = questions
                .OrderBy(x => Guid.NewGuid())
                .Select(x => new
                {
                    qnId = x.QnId,
                    qnInWords = x.QnInWords,
                    imageName = x.ImageName,
                    options = new string[]
                    {
                        x.Option1,
                        x.Option2,
                        x.Option3,
                        x.Option4
                    }
                });

            return Ok(randomized);
        }

        // ============================
        // GET: api/Question/5
        // ============================
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions
                .AsNoTracking()
                .FirstOrDefaultAsync(q => q.QnId == id);

            if (question == null)
                return NotFound(new { message = "Question not found" });

            return Ok(question);
        }

        // ============================
        // POST: api/Question
        // Create Question
        // ============================
        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestion),
                new { id = question.QnId }, question);
        }

        // ============================
        // POST: api/Question/GetAnswer
        // Return Correct Answers for Selected Questions
        // ============================
        [HttpPost("GetAnswer")]
        public async Task<IActionResult> RetrieveAnswers([FromBody] int[] qnIds)
        {
            if (qnIds == null || qnIds.Length == 0)
                return BadRequest(new { message = "Question Id list is empty" });

            var answers = await _context.Questions
                .Where(q => qnIds.Contains(q.QnId))
                .Select(x => new
                {
                    qnId = x.QnId,
                    qnInWords = x.QnInWords,
                    imageName = x.ImageName,
                    options = new string[]
                    {
                        x.Option1,
                        x.Option2,
                        x.Option3,
                        x.Option4
                    },
                    answer = x.Answer
                })
                .ToListAsync();

            return Ok(answers);
        }

        // ============================
        // PUT: api/Question/5
        // Update Question
        // ============================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestion(int id, Question question)
        {
            if (id != question.QnId)
                return BadRequest(new { message = "Question ID mismatch" });

            var existingQuestion = await _context.Questions.FindAsync(id);

            if (existingQuestion == null)
                return NotFound(new { message = "Question not found" });

            // Update fields manually (Best Practice)
            existingQuestion.QnInWords = question.QnInWords;
            existingQuestion.Option1 = question.Option1;
            existingQuestion.Option2 = question.Option2;
            existingQuestion.Option3 = question.Option3;
            existingQuestion.Option4 = question.Option4;
            existingQuestion.Answer = question.Answer;
            existingQuestion.ImageName = question.ImageName;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ============================
        // DELETE: api/Question/5
        // ============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound(new { message = "Question not found" });

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}