import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const users = {};

// 사용자 연결 확인
io.on("connection", (socket) => {
  console.log("a user connected");

  // 닉네임 설정
  socket.on("set nickname", (nickname) => {
    users[socket.id] = nickname;
    console.log(`${nickname}이(가) 연결되었습니다.`);
  });

  // 유저 목록 조회
  socket.on("get users", () => {
    updateAllUsers();
  });

  // 유저 목록 조회
  socket.on("get users", () => {
    updateAllUsers();
  });

  // 로그아웃 - 접속한 유저 삭제 조회
  socket.on("set logout", (nickname) => {
    console.log(users[socket.id], "님이 로그아웃하셧습니다.");
    delete users[socket.id]; // 해당 사용자 데이터 제거
  });

  // 연결 끊김 확인
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // 로그 출력
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// 유저 목록 업데이트 ?
function updateAllUsers() {
  io.emit("all users", Object.values(users));
}

server.listen(port, () => {
  console.log("server running at http://localhost:3000");
});
