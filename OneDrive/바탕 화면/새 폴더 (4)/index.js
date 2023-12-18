const socket = io();

const $form = document.getElementById('form'); // 폼 태그
const $nickname = document.getElementById('nickname'); // 닉네임 입력란
const $input = document.getElementById('input'); // 채팅 입력란
const $messages = document.getElementById('messages'); // 채팅 리스트
const $nicknameBtn = document.getElementById('nickname_btn'); // 닉네임 등록 버튼
const $logoutBtn = document.getElementById('logout_btn'); // 로그아웃 버튼

//------ 사용자 관리
// // 로그인 버튼 눌렀을 때
// 페이지 새로고침해야 새로운 유저가 등록됨
function setNickname(nickname) {
  socket.emit('set nickname', nickname); // 서버에 set nickname를 실행하도록 요청
  socket.emit('chat message', `${nickname}님이 입장하셨습니다!`);
  toggleUserBtn('login'); // 로그인 버튼 토글
}

// // 로그아웃 버튼 눌렀을 때
function logoutUser(nickname) {
  socket.emit('set logout', nickname); // 서버에 set logout를 실행하도록 요청
  socket.emit('chat message', `${nickname}님이 퇴장하셨습니다!`);
  toggleUserBtn('logout'); // 로그아웃 버튼 토글
}

// // 전체 유저 확인하기 버튼 눌렀을 때
// 서버에서 정의한 all users가 호출될 때 실행
socket.on('all users', (users) => {
  console.log('Connected Users: ', users);
});

function getUsers() {
  socket.emit('get users'); // 서버에 get users를 실행하도록 요청
}

//------ 채팅
// // 채팅 입력 버튼을 눌렀을 때
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  if ($input.value) {
    // 서버에서 정의한 chat message 실행하도록 요청
    socket.emit('chat message', ` ${$nickname.value} : ${$input.value}`);
    $input.value = ''; // 채팅 입력란 초기화
  }
});

// 서버에서 정의한 chat message가 호출될 때 실행
socket.on('chat message', (msg) => {
  // 입력된  채팅 목록에 추가
  const item = document.createElement('li'); // 추가할 채팅
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// // 기타 함수들
// 로그인/로그아웃 토글?
const toggleUserBtn = (type) => {
  console.log('type: ', type);
  if (type === 'login') {
    $nickname.disabled = true; // 닉네임 입력란 비활성화
    $nicknameBtn.style.display = 'none'; // 닉네임 설정 버튼 비활성화
    $logoutBtn.style.display = 'block'; // 닉네임 설정 버튼 비활성화
  } else if (type === 'logout') {
    $nickname.value = ''; // 닉네임 입력란 초기화
    $nickname.disabled = false; // 닉네임 입력란 활성화
    $nicknameBtn.style.display = 'block'; // 닉네임 설정 버튼 활성화
    $logoutBtn.style.display = 'none'; // 닉네임 설정 버튼 비활성화
  }
};