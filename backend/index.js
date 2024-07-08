const Koa = require('koa'),
    route = require('koa-route'),
    websockify = require('koa-websocket')
serve = require('koa-simple-static').default;
const app = websockify(new Koa());
const { randomUUID } = require('crypto')

let users = []
let sockets = []

const broadcast = (message) => {
    sockets.map(({ socket }) => socket.send(message))
}
const broadcastOnlineUsers = () => {
    broadcast(JSON.stringify({ messageType: 'userRefresh', users }))
}
const findUserSocketById = (userId) => sockets.find((socket) => socket.userId === userId).socket
const broadcastRemovedUser = (userId) => {
    const user = sockets.find((socket) => socket.userId === userId)
    if (user) {
        sockets = sockets.filter((socket) => socket.userId !== userId)
        users = users.filter((user) => user.userId !== userId)
        broadcastOnlineUsers();
    }
}
const handleAuthenticationRequest = (parsedMessage, ctx, userId) => {
    const { registerAs } = parsedMessage;

    if (users.findIndex((user) => user.username === registerAs) >= 0) {
        ctx.websocket.send(JSON.stringify({ messageType: 'registerError', message: "User with this name already exists." }));
    } else {
        //TODO: add user state (available/busy) to user object
        const newUser = { userId, username: registerAs }

        users.push(newUser)
        sockets.push({ userId, socket: ctx.websocket })

        ctx.websocket.send(JSON.stringify({ messageType: 'authentication', ...newUser }))
        broadcastOnlineUsers()
    }
}


// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function (ctx, next) {
    // return `next` to pass the context (ctx) on to the next ws middleware
    return next(ctx);
});

// Using routes
app.ws.use(route.all('/', function (ctx) {
    const userId = randomUUID() // avem o noua conexiune la care asignam un id unic
    console.log("Opened socket", userId)
    ctx.websocket.send(JSON.stringify({ messageType: 'connection', message: 'Connected to WebSocket successfully.' }));
    ctx.websocket.on('message', function (message) {
        // do something with the message from client
        try {
            const parsedMessage = JSON.parse(message)
            //TODO: use switch instead
            if (parsedMessage.messageType === 'authentication') {
                handleAuthenticationRequest(parsedMessage, ctx, userId)
            } else if (parsedMessage.messageType === 'userRefresh')
                ctx.websocket.send(JSON.stringify({ messageType: 'userRefresh', users }))

            if(parsedMessage.messageType === 'joinRequest'){
                const { clientId, hostId } = parsedMessage
                const hostSocket = findUserSocketById(hostId)

                users = users.map((user) => {
                    return user.userId === clientId ? {...user, userStatus: 'busy'} : user
                })

                changeUserStatus(clientId, 'busy')

                hostSocket.send(JSON.stringify({ messageType: 'joinRequest', clientId }))
            }

            if(parsedMessage.messageType === 'acceptRequest') {
                const { clientId, hostId } = parsedMessage
                const hostSocket = ctx.websocket
                const clientSocket = findUserSocketById(clientId)
                const roomId = randomUUID()

                rooms.push({ roomId, hostSocket, clientSocket })

                changeUserStatus(hostId, 'busy')

                hostSocket.send(JSON.stringify({ messageType: 'acceptRequest', roomId }))
                clientSocket.send(JSON.stringify({ messageType: 'acceptRequest', roomId }))
            }

            if(parsedMessage.messageType === 'cancelRequest') {
                const { cancellerType, targetId, cancellerId } = parsedMessage
                const targetSocket = findUserSocketById(targetId)

                changeUserStatus(cancellerType === 'host' ? targetId : cancellerId, 'available')

                targetSocket.send(JSON.stringify({ messageType: 'cancelRequest', cancellerType, cancellerId }))
            }

            // TODO: game room message handling
            if(parsedMessage.messageType === 'gameUpdate') {
                const { roomId, gameData } = parsedMessage
                const currentRoom = rooms.find(room => room.roomId === roomId)

                currentRoom.hostSocket.send(JSON.stringify({ messageType: 'gameUpdate', gameData }))
                currentRoom.clientSocket.send(JSON.stringify({ messageType: 'gameUpdate', gameData }))
            }
        } catch (err) {
            console.log(err)
        }
    });
    //TODO: handle user disconnects, eventually reconnection attempts on unintentional disconnect
    
    ctx.websocket.on('close', () => {
        const registeredSocket = sockets.find((socket) => socket.userId === userId)
        console.log()

        if(registeredSocket) {
            sockets = sockets.filter((socket) => socket.userId !== userId)
            users = users.filter((user) => user.userId !== userId)
            broadcastUserRefresh();
        }
    })
}));


app.use(serve({
    dir: '../frontend/dist',
    index: 'index.html',
}))

app.listen(8080, () => {
    console.log("Listening on port 8080")
});
