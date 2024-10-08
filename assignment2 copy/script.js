const myVideo = document.querySelector("#my-video");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");

playPauseBtn.addEventListener("click", togglePlay);

function togglePlay() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImg.src = "pause.png"; // 수정: 비디오 재생 시 'pause' 이미지로 변경
  } else {
    myVideo.pause();
    playPauseImg.src = "play.png"; // 수정: 비디오 멈춤 시 'play' 이미지로 변경
  }
}

const muteUnmuteBtn = document.querySelector("#mute-unmute-btn");
const muteUnmuteImg = document.querySelector("#mute-unmute-img");

muteUnmuteBtn.addEventListener("click", toggleSound);

function toggleSound() {
  if (myVideo.muted) {
    myVideo.muted = false;
    muteUnmuteImg.src = "sound.png"; // 소리가 켜졌을 때는 'sound' 이미지
  } else {
    myVideo.muted = true;
    muteUnmuteImg.src = "no sound.png"; // 음소거 시 'no sound' 이미지
  }
}

myVideo.addEventListener("timeupdate", showProgress);

const progressBar = document.querySelector("#progress-bar-fill");
const videoTime = document.querySelector("#video-time");
function showProgress() {
  const currentTime = myVideo.currentTime;
  const progress = (currentTime / myVideo.duration) * 100;
  progressBar.style.width = progress + "%"; // 진행바 너비 업데이트
}
myVideo.addEventListener("timeupdate", updateProgressBar);

function updateProgressBar() {
  // 현재 시간을 텍스트로 표시 (소수점 둘째 자리까지)
  videoTime.textContent = myVideo.currentTime.toFixed(2);

  // 진행바의 너비를 현재 재생 시간에 비례하여 설정
  const value = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = value + "%";
}

const step1Btn = document.querySelector("#step-1-btn");
step1Btn.addEventListener("click", gotoStep1);

function gotoStep1() {
  myVideo.currentTime = 52.62; // 1번 버튼을 클릭하면 해당 시간으로 이동
}

const step2Btn = document.querySelector("#step-2-btn");
step2Btn.addEventListener("click", gotoStep2);

function gotoStep2() {
  myVideo.currentTime = 105.65; // 2번 버튼을 클릭하면 해당 시간으로 이동
}

// 좋아요 카운트를 표시할 요소와 버튼 가져오기
const likesBtn = document.querySelector("#like-btn");
const likesCountElement = document.querySelector("#likes-count");
let likeCount = 0;

likesBtn.addEventListener("click", function () {
  likeCount++;
  likesCountElement.textContent = likeCount; // 업데이트
});

myVideo.addEventListener("dblclick", toggleFullScreen);

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    myVideo.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// 비디오 목록 정의
const videos = [
  {
    name: "intro",
    src: "intro.mp4", // intro 영상의 경로
  },
  {
    name: "dance",
    src: "dance.mp4", // dance 영상의 경로
  },
  {
    name: "Official MV",
    src: "Official MV.mp4", // 기본적으로 재생될 비디오
  },
];

// 특정 비디오로 바로 이동하는 버튼 (첫 번째, 두 번째 비디오)
const firstVideoBtn = document.querySelector("#first-video-btn");
const secondVideoBtn = document.querySelector("#second-video-btn");

firstVideoBtn.addEventListener("click", function () {
  currentIndex = 0; // intro 비디오로 이동
  playVideoAtIndex(currentIndex);
});

secondVideoBtn.addEventListener("click", function () {
  currentIndex = 1; // dance 비디오로 이동
  playVideoAtIndex(currentIndex);
});

let currentIndex = 0; // 현재 비디오 인덱스를 추적하는 변수

function playVideoAtIndex(index) {
  myVideo.src = videos[index].src;
  myVideo.load();
  myVideo.play();
}

// 이전 및 다음 버튼으로 비디오 전환
const prevBtn = document.querySelector("#previous-btn");
const nextBtn = document.querySelector("#next-btn");

prevBtn.addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--; // 이전 비디오로 이동
  } else {
    currentIndex = videos.length - 1; // 마지막 비디오로 이동
  }
  playVideoAtIndex(currentIndex);
});

nextBtn.addEventListener("click", function () {
  if (currentIndex < videos.length - 1) {
    currentIndex++; // 다음 비디오로 이동
  } else {
    currentIndex = 0; // 첫 번째 비디오로 이동
  }
  playVideoAtIndex(currentIndex);
});
