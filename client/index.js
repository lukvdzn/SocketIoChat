 // $(...) equivalent to document.ready
 $(function () {
    let userTyping = false;

    const socket = io();
    const textBox = $('#m');
    const nameBox = $('#name');
    const messageList = $('#messages');

    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      const text = textBox.val();
      const name = nameBox.val();
      socket.emit('chat message', {name : name, text : text});
      textBox.val('');
      return false;
    });

    //user is typing feature
    textBox[0].addEventListener('input', evt => {
      socket.emit('user typing', `${nameBox.val()} is typing...`);
    });
    
    socket.on('chat message', function({name, text}){
        if(userTyping) messageList.children().last().remove();
        userTyping = false;
        //append the name and the message to the <ul>
        messageList.append($('<li>').text(`${name}: ${text}`));
        //scroll into the view of the last <ul> child
        document.getElementById('messages').lastChild.scrollIntoView();
    });

    socket.on('user typing', msg => {
        if(!userTyping)
        {
            userTyping = true;
            messageList.append($('<li>').text(msg));
        }
    });
});
  