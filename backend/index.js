const Koa = require("koa"),
  route = require("koa-route"),
  websockify = require("koa-websocket");
serve = require("koa-simple-static").default;
const app = websockify(new Koa());
const { randomUUID } = require("crypto");

let users = [];
let sockets = [];

const broadcast = (message) => {
  sockets.map(({ socket }) => socket.send(message));
};
const broadcastOnlineUsers = () => {
  broadcast(JSON.stringify({ messageType: "userRefresh", users }));
};
const findUserSocketById = (userId) =>
  sockets.find((socket) => socket.userId === userId).socket;
const broadcastRemovedUser = (userId) => {
  const user = sockets.find((socket) => socket.userId === userId);
  if (user) {
    sockets = sockets.filter((socket) => socket.userId !== userId);
    users = users.filter((user) => user.userId !== userId);
    broadcastOnlineUsers();
  }
};
const handleAuthenticationRequest = (parsedMessage, ctx, userId) => {
  const { registerAs } = parsedMessage;

  if (users.findIndex((user) => user.username === registerAs) >= 0) {
    ctx.websocket.send(
      JSON.stringify({
        messageType: "registerError",
        message: "User with this name already exists.",
      })
    );
  } else {
    //TODO: add user state (available/busy) to user object
    const newUser = { userId, username: registerAs };

    users.push(newUser);
    sockets.push({ userId, socket: ctx.websocket });

    ctx.websocket.send(
      JSON.stringify({ messageType: "authentication", ...newUser })
    );
    broadcastOnlineUsers();
  }
};

// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function (ctx, next) {
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next(ctx);
});

// Using routes
app.ws.use(
  route.all("/", function (ctx) {
    const userId = randomUUID(); // avem o noua conexiune la care asignam un id unic
    console.log("Opened socket", userId);
    ctx.websocket.send(
      JSON.stringify({
        messageType: "connection",
        message: "Connected to WebSocket successfully.",
      })
    );
    ctx.websocket.on("message", function (message) {
      // do something with the message from client
      try {
        const parsedMessage = JSON.parse(message);
        //TODO: use switch instead
        if (parsedMessage.messageType === "authentication") {
          handleAuthenticationRequest(parsedMessage, ctx, userId);
        } else if (parsedMessage.messageType === "userRefresh")
          ctx.websocket.send(
            JSON.stringify({ messageType: "userRefresh", users })
          );
        else if (!users.find((user) => user.userId === userId)) {
          ctx.websocket.send(
            JSON.stringify({
              messageType: "authentication",
              message: "You need to authenticate first.",
            })
          );
        } else {
          // get each receiver socket for the message
          let { receivers, message } = parsedMessage;
          if (!Array.isArray(receivers))
            ctx.websocket.send(
              JSON.stringify({
                error: "error",
                message: "Receivers must be an array",
              })
            );
          receivers.forEach((receiver) => {
            const receiverSocket = findUserSocketById(receiver);
            if (receiverSocket)
              receiverSocket.send(JSON.stringify({ sender: userId, message }));
            else
              ctx.websocket.send(
                JSON.stringify({
                  error: "error",
                  message: `Receiver ${receiver} not found`,
                })
              );
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
    //TODO: handle user disconnects, eventually reconnection attempts on unintentional disconnect
    ctx.websocket.on("close", () => broadcastRemovedUser(userId)); // daca se inchide conexiunea, stergem userul din lista, si notificam restul userilor
  })
);

app.use(
  serve({
    dir: "../frontend/dist",
    index: "index.html",
  })
);

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
