const io = require("socket.io")(3001, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("get-document", (documentId) => {
    // const data = "";

    socket.join(documentId);
    socket.emit("load-document");

    socket.on("send-changes", (delta) => {
      // console.log(delta);
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("change-document-lock-status", (documentLockStatus) => {
      socket.broadcast.to(documentId).emit("change-document-lock-status", documentLockStatus);
    });
  });
});
