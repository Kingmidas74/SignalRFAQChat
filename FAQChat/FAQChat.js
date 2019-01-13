var FAQChat = function (serverURI, userData) {

    var _systemObjects = {
        SERVER_URL: 'http://localhost:59915/',
        chat: {},
        question_template: "<li class='faq-chat-question'><p class= 'faq-chat-question-text'>{{question}}</p><div class='faq-chat-question-answerscount' data-question-id='{{questionid}}'>{{answercount}}</div></li >"
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
        _elements['form'] = $('#faq-chat-id--form');
        _elements['displayname'] = $('#faq-chat-username');
        _elements['message'] = $('#faq-chat-id--message');
        _elements['discussion'] = $('#faq-chat-list');
        _elements['askbutton'] = $('#faq-chat-askbutton');
    };

    var _sendMessage = function (e) {
        e.preventDefault();
        _systemObjects.chat.server.askQuestion(_elements.displayname.text(), 'test', _elements.message.val());
        _elements.message.val('').focus();
    };

    var _recieveMessage = function (name, title, question) {
        _elements.discussion.append($(_systemObjects.question_template.replace("{{question}}", question).replace("{{answercount}}", name).replace("{{questionid", title)));
    };

    var _loadForm = function (html) {
        $(html).appendTo('body');        
        _memorizeElements();
        _elements.askbutton.click(function () {
            _elements.form.toggleClass('hide');
        });
        _elements.displayname.text(_userData.UserName);
        _elements.message.focus();
        _elements.form.submit(_sendMessage);
    };




    var _startSocket = function () {
        $.connection.hub.url = _systemObjects.SERVER_URL + '/signalr';
        $.connection.hub.disconnected(function () {

        });

        
        _systemObjects.chat = $.connection.baseHub;
        _systemObjects.chat.client.askQuestion = _recieveMessage;
        _systemObjects.chat.client.addAnswer = function (questionId, text) { };
        _systemObjects.chat.client.sendForm = _loadForm;

        
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