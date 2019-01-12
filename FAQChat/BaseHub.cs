using System;
using System.IO;
using Microsoft.AspNet.SignalR;

namespace FAQChat
{
    public class BaseHub : Hub
    {

        public void LoadChat()
        {
            Clients.Caller.sendForm(File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + @"assets\chat_template.htm"));
        }

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