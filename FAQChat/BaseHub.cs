using System;
using Microsoft.AspNet.SignalR;

namespace FAQChat
{
    public class BaseHub : Hub
    {
        public void AskQuestion(string name, string title, string question)
        {
            Clients.All.askQuestion(name, title, question);
        }

        public void AddAnswer(Guid questionId, string text)
        {
            Clients.All.addAnswer(questionId, text);
        }

    }
}