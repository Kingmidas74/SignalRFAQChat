using System;
using System.Collections.Generic;

namespace FAQChat.Models
{
    public class Question
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public String Text { get; set; } = String.Empty;
        public List<Answer> Answers { get; set; } = new List<Answer>();
        public User User { get; set; } = default(User);
    }
}