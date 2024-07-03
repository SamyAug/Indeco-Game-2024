const Koa = require('koa'),
    route = require('koa-route'),
    websockify = require('koa-websocket')
serve = require('koa-simple-static').default;
const app = websockify(new Koa());

const users = []
const sockets = []

const broadcast = (message) => {
    sockets.map(({ socket }) => socket.send(message))
}

// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function (ctx, next) {
    // return `next` to pass the context (ctx) on to the next ws middleware
    return next(ctx);
});

// Using routes
app.ws.use(route.all('/', function (ctx) {
    ctx.websocket.send(JSON.stringify({ messageType: 'connection', message: 'Connected to WebSocket successfully.'}));
    const userId = Math.floor(Math.random() * 100000)
    ctx.websocket.on('message', function (message) {
        // do something with the message from client
        try {
            const { registerAs } = JSON.parse(message)

            if(users.indexOf(registerAs) >= 0) {
                ctx.websocket.send("User with this name already exists.");
            } else {
                const newUser = { userId, username: registerAs }

                users.push(newUser)
                sockets.push({ userId, socket: ctx.websocket })

                broadcast(JSON.stringify({ messageType: 'userRefresh', users}))
                ctx.websocket.send(JSON.stringify({ messageType: 'authentication', ...newUser }))
            }


        } catch (err) {
            console.log(err)
        }
    });
}));
app.use(serve({
    dir: '../frontend/dist',
    index: 'index.html',
}))

app.use(route.get('/helloword', function (ctx) {
    ctx.body = 'Hello World!';
}
));

app.listen(8080, () => {
    console.log("Listening on port 8080")
});
