 // $(...) equivalent to document.ready
 $( _ => {
    //check if user is typing
    let userTyping = false;
    const dots = ["...", ".  ", " . ", "  ."];
    let dotIndex = 0;
    //timer for the ... animation whilst typing
    let timer;

    const socket = io(); // client socket
    const textBox = $('#m'); // user message input
    const nameBox = $('#name'); // name of current user
    const messageList = $('#messages'); // the unordered Message list
   
    
    //when a user submits a message
    $('form').submit( e => {
      e.preventDefault(); // prevents page reloading
      const text = textBox.val();
      const name = nameBox.val();
      socket.emit('chat message', {name : name, text : text});
      textBox.val('');
      return false;
    });

    //user is typing feature
    textBox[0].addEventListener('input', evt => {
      socket.emit('user typing', `${nameBox.val()} is typing`);
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
});
  