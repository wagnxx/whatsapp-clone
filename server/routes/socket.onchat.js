module.exports = function (socket) {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log('connected id', id);

  socket.on('send-message', ({ recipients, text }) => {
    if (id === 123 || id === '123') {
      console.log('来自手机的message:', { recipients, text });
    }
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });

  socket.on('send-file-message', (prams) => {
    console.log('file message::', prams);
    const { recipients, file } = prams;
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('receive-file-message', {
        recipients: newRecipients,
        sender: id,
        file,
      });
    });
  });
};
