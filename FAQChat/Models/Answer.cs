using System;

namespace FAQChat.Models
{
    public class Answer
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public String Text { get; set; } = String.Empty;
        public Guid QuestionId { get; set; } = Guid.NewGuid();
        public Int32 Scores { get; set; } = 0;
        public User User { get; set; } = default(User);
    }
}