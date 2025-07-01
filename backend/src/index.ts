import { Server as SocketIoServer } from "socket.io";
import { app } from "./app";
import { setupYoga } from "./graphql";

const httpServer = app.listen(4000, () => {
	console.log("Server is running on http://localhost:4000/graphql 🎉");
});

const io = new SocketIoServer(httpServer, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

const yoga = setupYoga(io);

app.use("/graphql", yoga.requestListener);
