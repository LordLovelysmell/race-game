import http from "http";
import path from "path";
import express from "express";
import { SocketManager } from "./SocketManager";

const DOC_ROOT = "./../dist/";
const PORT = 3000;

const app = express();

const server = http.createServer(app);

const docRoot = path.join(__dirname, DOC_ROOT);
const staticContent = express.static(docRoot);
app.use(staticContent);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

const socketManager = new SocketManager(server);
