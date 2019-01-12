var FAQChat = function (jQuery) {
    var $ = jQuery;

    var _systemObjects = {
        SERVER_URL: 'http://localhost:59913/',
        chat: {}
    };

    var _elements = {};

    var _init = function (initCallback) {
        $.getScript(_systemObjects.SERVER_URL + "Scripts/jquery.signalR-2.2.2.min.js", function () {
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
        _elements['displayname'] = $('#faq-chat-id--displayname');
        _elements['message'] = $('#faq-chat-id--message');
        _elements['discussion'] = $('#faq-chat-id--discussion');
    };

    var _sendMessage = function (e) {
        e.preventDefault();
        _systemObjects.chat.server.askQuestion(_elements.displayname.text(), 'test', _elements.message.val());
        _elements.message.val('').focus();
    };

    var _recieveMessage = function (name, title, question) {
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(question).html();
        _elements.discussion.append('<li><strong>' + encodedName + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };




    var _startSocket = function () {
        $.connection.hub.url = _systemObjects.SERVER_URL + '/signalr';
        $.connection.hub.disconnected(function () {

        });

        
        _systemObjects.chat = $.connection.baseHub;
        _systemObjects.chat.client.askQuestion = _recieveMessage;
        _systemObjects.chat.client.addAnswer = function (questionId, text) { };
        _systemObjects.chat.client.sendForm = function (content) {
            var divElem = $('<div />').html(content);
            divElem.appendTo('body');
            _memorizeElements();

            _elements.displayname.text(prompt('Enter your name:', ''));
            _elements.message.focus();
            _elements.form.submit(_sendMessage);
        };

        
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



$(function () {
    var chat = new FAQChat($);
    chat.Init();
});