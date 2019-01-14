using System;
using System.Collections.Generic;
using System.IO;
using FAQChat.Models;
using Microsoft.AspNet.SignalR;

namespace FAQChat
{
    public class BaseHub : Hub
    {
        public BaseHub()
        {
            
        }

        public void LoadChat()
        {
            Clients.Caller.sendChat(File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + @"assets\chat_template.htm"), new List<Question>());
        }

        public void AskQuestion(Question question)
        {
            question.Id = Guid.NewGuid();
            Clients.All.sendQuestion(question);
        }

        public void AddAnswer(Answer answer)
        {
            answer.Id = Guid.NewGuid();
            Clients.All.sendAnswer(answer);
        }
    }
}