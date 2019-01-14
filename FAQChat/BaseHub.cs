using System;
using System.Collections.Generic;
using System.IO;
using FAQChat.Models;
using Microsoft.AspNet.SignalR;

namespace FAQChat
{
    public class BaseHub : Hub
    {
        private List<Question> _qs = new List<Question>();
        public BaseHub()
        {
            var questions = new List<Question>();
            for (var i = 0; i < 10; i++)
            {
                var qId = Guid.NewGuid();
                var q = new Question()
                {
                    Id = qId,
                    Text = "Test" + i.ToString(),
                    User = new User()
                    {
                        Id = Guid.NewGuid(),
                        Name = "User" + i.ToString()
                    },
                    Answers = new List<Answer>()
                    {
                        new Answer()
                        {
                            Id=Guid.NewGuid(),
                            QuestionId=qId,
                            Scores=(new Random().Next()),
                            Text="Answer+"+i.ToString(),
                            User = new User()
                            {
                                Id=Guid.NewGuid(),
                                Name="User__"
                            }
                        }
                    }
                };
                questions.Add(q);
            }
            _qs = questions;
        }

        public void LoadChat()
        {
            Clients.Caller.sendChat(File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + @"assets\chat_template.htm"), _qs);
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