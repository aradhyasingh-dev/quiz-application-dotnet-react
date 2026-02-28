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

        // GET: api/Question
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<object>>> GetQuestions()
        //{
        //    var random5Qns = await _context.Questions
        //        .Select(x => new
        //        {
        //            qnId = x.QnId,
        //            qnInWords = x.QnInWords,
        //            imageName = x.ImageName,
        //            options = new string[]
        //            {
        //                x.Option1,
        //                x.Option2,
        //                x.Option3,
        //                x.Option4
        //            }
        //        })
        //        .OrderBy(x => Guid.NewGuid())
        //        .Take(5)
        //        .ToListAsync();

        //    return Ok(random5Qns);
        //}

        // GET: api/Question/5



        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestions()
        {
            var allQns = await _context.Questions
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
                })
                .OrderBy(x => Guid.NewGuid()) // random order
                .ToListAsync();

            return Ok(allQns);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            return question;
        }

        // POST: api/Question/GetAnswer
        [HttpPost("GetAnswer")]
        public async Task<IActionResult> RetrieveAnswers([FromBody] int[] qnIds)
        {
            var answers = await _context.Questions
                .Where(x => qnIds.Contains(x.QnId))
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

        // PUT: api/Question/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestion(int id, Question question)
        {
            if (id != question.QnId)
                return BadRequest();

            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Question/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

