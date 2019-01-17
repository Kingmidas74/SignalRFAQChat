var FAQChat = function (serverURI, userData) {

    var _questions = [];
    var _currentQuestion = null;

    var _systemObjects = {
        SERVER_URL: 'http://localhost:59915/',
        chat: {},
        ids: {
            questionList: "#faq-chat-id--questionList",
            questionListTemplate: "#faq-chat-id--questionListTemplate",
            expandedQuestion: "#faq-chat-id--expandedQuestionPanel",
            expandedQuestionTemplate: "#faq-chat-id--expandedQuestionPanelTemplate"
        }
    };

    var _userData = {
        UserId: '0',
        UserName: 'test',
        IsWindow: false
    };

    var _elements = {};

    
    constructor = function (serverURI, userData) {
        if (!!!serverURI) throw "You shoud pass serverURI of chat";
        if (serverURI[serverURI.length - 1] !== '/') serverURI = serverURI + '/';
        _systemObjects.SERVER_URL = serverURI;

        jQuery.extend(_userData, userData);
    }(serverURI, userData);
    

    var getQuestionById = function (qId) {
        var id = _currentQuestion;
        if (!!qId) id = qId;
        var q = _questions.filter(function (v, i) {
            return v.Id === id;
        })[0];
        if (!!q === false) throw "Question wasn't selected!";
        return q;
    }

    var getAnswerById = function (answerId) {
        var a = getQuestionById().Answers.filter(function (a, i) {
            return a.Id === answerId
        })[0];
        if (!!a === false) throw "Answer not exists!";
        return a;
    }


    var _init = function (initCallback) {
        $.getScript("https://cdn.jsdelivr.net/npm/signalr@2.4.0/jquery.signalR.min.js", function () {
            $.getScript("https://www.jsviews.com/download/jsviews.min.js", function () {
                $.getScript(_systemObjects.SERVER_URL + "signalr/hubs", initCallback);
            });
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
        _elements['questionscreen'] = $('#faq-chat-id--questionsscreen');
        _elements['answersscreen'] = $('#faq-chat-id--answersscreen');

        _elements['questionform'] = $('#faq-chat-id--questionform');
        _elements['answerform'] = $('#faq-chat-id--answerform');

        _elements['questionmessage'] = $('#faq-chat-id--questionmessage');
        _elements['answermessage'] = $('#faq-chat-id--answermessage');

        _elements['askbutton'] = $('#faq-chat-askbutton');
        _elements['answerbutton'] = $('#faq-chat-answerbutton');
        _elements['backbutton'] = $("#faq-chat-backbutton");
    };

    var _sendQuestion = function (e) {
        e.preventDefault();
        var text = _elements.questionmessage.val();
        if (!!text===false && text === '') return;
        _systemObjects.chat.server.askQuestion({
            Text: text,
            User: {
                Name: _userData.UserName
            }
        });
        _elements.questionmessage.val('').focus();
    };

    var _sendAnswer = function (e) {
        e.preventDefault();
        var answer = _elements.answermessage.val();
        if(!!answer===false || answer.length<='0' || answer==='') return;
        _systemObjects.chat.server.addAnswer({
            Text: answer,
            User: {
                Name: _userData.UserName
            },
            QuestionId: _currentQuestion
        });        
        _elements.answermessage.val('').focus();
    };

    var _reDrawQuestions = function () {        
        $.templates(_systemObjects.ids.questionListTemplate).link(_systemObjects.ids.questionList, { questions: _questions }, { selectQuestion: toggleAnswers });
    };

    var _reDrawAnswers = function (questionId) {        
        if (!!_currentQuestion === false || _currentQuestion !== questionId) return;
        $.templates(_systemObjects.ids.expandedQuestionTemplate).link(_systemObjects.ids.expandedQuestion, getQuestionById((!!questionId) ? questionId : _currentQuestion), { increaseScore: increaseScore, decreaseScore: decreaseScore });
    }

    var increaseScore = function (answerId) {        
        getAnswerById(answerId).Scores++;
        _reDrawAnswers(_currentQuestion);
    }

    var decreaseScore = function (answerId) {        
        getAnswerById(answerId).Scores--;
        _reDrawAnswers(_currentQuestion);
    }

    var _recieveQuestion = function (q) {
        _questions.push(q);
        _reDrawQuestions();
    };

    var _recieveAnswer = function (a) {        
        getQuestionById(a.QuestionId).Answers.push(a);
        _reDrawQuestions();
        _reDrawAnswers(a.QuestionId);        
    };

    var toggleAnswers = function (questionId) {
        if (!!questionId) {
            _elements.questionscreen.addClass('hide');
            _currentQuestion = questionId;
            _reDrawAnswers(questionId);
            _elements.answersscreen.removeClass('hide');
        }
        else {
            _elements.answersscreen.addClass('hide');            
            _currentQuestion = null;
            _reDrawQuestions();
            _elements.questionscreen.removeClass('hide');
        }
    }

    var _recieveForm = function (html, questions) {
        $(html).appendTo('body');        
        _memorizeElements();

        _questions = questions;
        _reDrawQuestions();

        _elements.askbutton.click(function () {
            _elements.questionform.toggleClass('hide');
        });
        _elements.answerbutton.click(function () {
            _elements.answerform.toggleClass('hide');
        });
        _elements.backbutton.click(function () {
            toggleAnswers();
        });

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
        _systemObjects.chat.client.sendChat = _recieveForm;

        $.connection.hub.start().done(function () {
            _systemObjects.chat.server.loadChat(); 
        });
    };

    return {
        Init: function () {
            _init(function () {
                _loadStyles();
                _startSocket();
            });
        }
    };
};