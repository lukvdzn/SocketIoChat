 // $(...) equivalent to document.ready
 $( _ => {
    //check if user is typing
    let userTyping = false;
    const dots = ["...", ".  ", " . ", "  ."];
    let dotIndex = 0;
    //timer for the ... animation whilst typing
    let timer;
    let username; // name of current client

    const socket = io(); // client socket
    const textBox = $('#m'); // user message input
    const messageList = $('#messages'); // the unordered Message list
    const usrContainer = $('#user-online-container');

    //hide the users sidebar from the beginning
    usrContainer.hide();

    $('#show-users').click(_ => {
      const list = $('#users');
      socket.emit('show users');
      socket.on('show users', users => {
        users.forEach(element => {
          list.append($('<li>').text(element.name));
        });
      usrContainer.show();
      });
        //append the name and the message to the <ul>
        messageList.append($('<li>').text(`${name}: ${text}`));
    });

    $('#username-input').submit(e => {
      e.preventDefault(); // prevend page reloading
      username = $('#name').val();
      $('#user-container').hide();
      socket.emit('client user name', username);
    });

    //when a user submits a message
    $('#text-input').submit( e => {
      e.preventDefault(); // prevents page reloading
      const text = textBox.val();
      socket.emit('chat message', {name : username, text : text});
      textBox.val('');
      return false;
    });

    //user is typing feature
    textBox[0].addEventListener('input', evt => {
        socket.emit('user typing', `${username} is typing`);
    });
    
    //when the socket retrieves a chat message emitted from the webserver
    socket.on('chat message', ({name, text}) => {
        if(userTyping)
        {
          messageList.children().last().remove();
          clearInterval(timer);
        }
        userTyping = false;
        //append the name and the message to the <ul>
        messageList.append($('<li>').text(`${name}: ${text}`));
        //scroll into the view of the last <ul> child
        document.getElementById('messages').lastChild.scrollIntoView();
    });

    //when the socket retrieves a dispatched 'user typing' message
    socket.on('user typing', msg => {
      if(!userTyping)
      {
        userTyping = true;
        messageList.append($('<li>').text(msg + dots[0]));
        
        timer = setInterval(() => {
        messageList.children().last().text(msg + dots[dotIndex++ % 4]);
        }, 500);
      }
    });

   
    //when a client has joined the chat
    socket.on('user joined', msg => {
      messageList.append($('<li>').text(msg).css('color', 'green'));
    });

    //when a client has left the chat
    socket.on('user left', msg => {
      messageList.append($('<li>').text(msg).css('color', 'red'));
    });
});
  