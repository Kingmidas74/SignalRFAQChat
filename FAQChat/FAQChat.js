var FAQChat = function (serverURI, userData) {

    var _questions = [];
    var _currentQuestion = null;

    var _systemObjects = {
        SERVER_URL: 'http://localhost:59915/',
        chat: {},
        question_template: "<li class='faq-chat-question' data-question-id='{{questionid}}'><p class= 'faq-chat-question-text'>{{question}}</p><div class='faq-chat-question-answerscount'>{{answercount}}</div></li >",
        answer_template: "<li class='faq-chat-questionpanel-answer'><p class= 'faq-chat-questionpanel-answer-text' >{{answertext}}</p><div class='faq-chat-questionpanel-answer-scores' data-answer-id='{{answerid}}'><div class='faq-chat-questionpanel-answer-scoresincrease' class='faq-chat-button icon small'>↑</div><span>{{scores}}</span><div class='faq-chat-questionpanel-answer-scoresdecrease' class='faq-chat-button icon small'>↓</div></div></li >"
    };

    var _elements = {};

    var _userData = {
        UserId: '0',
        UserName: 'test',
        IsWindow:false
    };

    if (!!!serverURI) {
        throw "You shoud pass serverURI of chat";
    }
    jQuery.extend(_userData, userData);
    if (serverURI[serverURI.length - 1] !== '/') serverURI = serverURI + '/';
    _systemObjects.SERVER_URL = serverURI;

    var _init = function (initCallback) {
        $.getScript("https://cdn.jsdelivr.net/npm/signalr@2.4.0/jquery.signalR.min.js", function () {
            $.getScript(_systemObjects.SERVER_URL + "signalr/hubs", initCallback);
        });
    };

    var _loadStyles = function () {
        $('<link>')
            .appendTo('head')
            .attr({
                type: 'text/css',
                rel: 'stylesheet',
                href: _systemObjects.SERVER_URL + 'assets/chat_template.css'
            });
    };

    var _memorizeElements = function () {
        _elements['questionform'] = $('#faq-chat-id--questionform');
        _elements['answerform'] = $('#faq-chat-id--answerform');
        _elements['questionmessage'] = $('#faq-chat-id--message');
        _elements['answermessage'] = $('#faq-chat-id--answermessage');
        _elements['discussion'] = $('#faq-chat-list');
        _elements['askbutton'] = $('#faq-chat-askbutton');
        _elements['answerbutton'] = $('#faq-chat-answerbutton');
        _elements['questionpanel'] = $("#faq-chat-id--questionpanel");
        _elements['backbutton'] = $("#faq-chat-backbutton");
        _elements['qheader'] = $("#faq-chat-q-header");
        _elements['aheader'] = $("#faq-chat-a-header");
    };

    var _sendQuestion = function (e) {
        e.preventDefault();
        _systemObjects.chat.server.askQuestion({
            Text: _elements.questionmessage.val(),
            User: {
                Name: _userData.UserName
            }
        });
        _elements.questionmessage.val('').focus();
    };

    var _sendAnswer = function (e) {
        e.preventDefault();
        _systemObjects.chat.server.addAnswer({
            Text: _elements.answermessage.val(),
            User: {
                Name: _userData.UserName
            },
            QuestionId: _currentQuestion
        });        
        _elements.answermessage.val('').focus();
    };

    var _reDrawQuestions = function () {
        _elements.discussion.empty();
        _questions.forEach(function (q) {
            _elements.discussion.append($(_systemObjects.question_template.replace("{{question}}", q.Text).replace("{{answercount}}", q.Answers.length).replace("{{questionid}}", q.Id)));
        });     
    }

    var _recieveQuestion = function (q) {
        _questions.push(q);
        _reDrawQuestions();
    };


    var _recieveAnswer = function (a) {
        _questions.filter(function (v, i) {
            return v.Id === _currentQuestion;
        })[0].Answers.push(a);
        //_elements.discussion.append($(_systemObjects.question_template.replace("{{question}}", q.Text).replace("{{answercount}}", q.Answers.length).replace("{{questionid}}", q.Id)));
    };

    var toggleAnswers = function (questionId) {
        if (!!questionId) {
            console.log(questionId);
            _elements.questionform.addClass('hide');
            _currentQuestion = questionId;
        }
        else {
            _elements.answerform.addClass('hide');
            _currentQuestion = null;
            _reDrawQuestions();
        }
        _elements.discussion.toggleClass('hide');
        _elements.questionpanel.toggleClass('hide');
        _elements.qheader.toggleClass('hide');
        _elements.aheader.toggleClass('hide');
    }

    var _loadForm = function (html, questions) {
        $(html).appendTo('body');        
        _memorizeElements();
        questions.forEach(function (q) {
            _recieveQuestion(q);
        });
        _questions = questions;
        _elements.askbutton.click(function () {
            _elements.questionform.toggleClass('hide');
        });
        _elements.answerbutton.click(function () {
            _elements.answerform.toggleClass('hide');
        });
        _elements.discussion.on('click', '.faq-chat-question', function (e) {
            toggleAnswers($(e.target).attr('data-question-id'));
        });
        _elements.backbutton.click(function () {
            toggleAnswers();
        });
        _elements.questionmessage.focus();
        _elements.questionform.submit(_sendQuestion);
        _elements.answerform.submit(_sendAnswer);
    };




    var _startSocket = function () {
        $.connection.hub.url = _systemObjects.SERVER_URL + '/signalr';
        $.connection.hub.disconnected(function () {

        });

        
        _systemObjects.chat = $.connection.baseHub;
        _systemObjects.chat.client.sendQuestion = _recieveQuestion;
        _systemObjects.chat.client.sendAnswer = _recieveAnswer;
        _systemObjects.chat.client.sendChat = _loadForm;

        
        $.connection.hub.start().done(function () {
            if (userData.IsWindow) _systemObjects.chat.server.loadChatWindow();            
            _systemObjects.chat.server.loadChat();            
                        
        });


    };

    return {
        Init: function () {
            _init(function () {
                _loadStyles();
                _startSocket();
            });
        },

        InitPage: function () {
            _userData.IsWindow = true;
            _init(function () {
                _loadStyles();
                _startSocket();
            });
        }
    };

};



$(function () {
    var chat = new FAQChat('http://localhost:59913',{        
        UserName: 'midas'
    });
    chat.Init();
});