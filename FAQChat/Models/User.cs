using System;

namespace FAQChat.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public String Name { get; set; } = String.Empty;
    }
}