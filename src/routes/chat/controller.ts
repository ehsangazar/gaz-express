const receive = async (io, socket, chatQueue, data) => {
  chatQueue.enqueue(data);
  if (chatQueue.size() > 12) {
    chatQueue.dequeue();
  }
  io.sockets.emit("chat:receive", chatQueue.getQueue());
};

export { receive };
