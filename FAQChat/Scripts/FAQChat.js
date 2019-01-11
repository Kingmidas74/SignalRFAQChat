$(function () {
    $.getScript("http://localhost:59913/Scripts/jquery.signalR-2.2.2.min.js", function () {
        $.getScript("http://localhost:59913/signalr/hubs", function () {
           /* $('<link>')
                .appendTo('head')
                .attr({
                    type: 'text/css',
                    rel: 'stylesheet',
                    href: 'http://localhost:59913/chat_template.css'
                });*/
            var divElem = $('<div/>')
                .load('http://localhost:59913/chat_template.html', function () {
                    $.connection.hub.url = 'http://localhost:59913/signalr';
                    var chat = $.connection.baseHub;
                    $.connection.hub.disconnected(function () {
                        alert("Connection lost");
                    });
                    // Create a function that the hub can call to broadcast messages.
                    chat.client.askQuestion = function (name, title, question) {
                        // Html encode display name and message.
                        var encodedName = $('<div />').text(name).html();
                        var encodedMsg = $('<div />').text(question).html();
                        // Add the message to the page.
                        $('#discussion').append('<li><strong>' + encodedName
                            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
                    };

                    chat.client.addAnswer = function (questionId, text) {
                        // Html encode display name and message.
                        var encodedName = $('<div />').text(name).html();
                        var encodedMsg = $('<div />').text(question).html();
                        // Add the message to the page.
                        $('#discussion').append('<li><strong>' + encodedName
                            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
                    };
                    // Get the user name and store it to prepend to messages.
                    $('#displayname').val(prompt('Enter your name:', ''));
                    // Set initial focus to message input box.
                    $('#message').focus();
                    // Start the connection.
                    $.connection.hub.start().done(function () {
                        $('#sendmessage').click(function () {
                            // Call the Send method on the hub.
                            console.log($('#displayname').val(), 'test', $('#message').val());
                            chat.server.askQuestion($('#displayname').val(), 'test', $('#message').val());
                            // Clear text box and reset focus for next comment.
                            $('#message').val('').focus();
                        });
                    });
                });
            divElem.appendTo('body');
            // Declare a proxy to reference the hub.
            
        });
    });
});

/*var signalRLibrary = document.createElement('script');
signalRLibrary.type = "text/javascript";
signalRLibrary.src = 'Scripts/jquery.signalR-2.2.2.min.js';
document.getElementsByTagName('body')[0].appendChild(signalRLibrary);

var signlaRHub = document.createElement('script');
signlaRHub.type = "text/javascript";
signlaRHub.src = "/signalr/hubs";
document.getElementsByTagName('body')[0].appendChild(signlaRHub);
*/

