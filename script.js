const bird = document.getElementById('bird'),
    score = document.getElementById('score'),
    gameContainer = document.getElementById('game-container'),
    start = document.getElementById('btn-start'),
    bg1 = document.querySelector('.bg-black1'),
    bg2 = document.querySelector('.bg-black2'),
    bgRe = document.querySelector('#btn-restart');

let scoreUpdate = 0,
    y = 0,
    Jumping = 0,
    timer = 0,
    lvlSpeedFrame = 360,
    lvlGameSpeed = 1.5,
    isJumping = false,
    isScore = false;

let velocity = 0;
let gravity = 0.1;
let jumpPower = -4;

// 벽을 관리할 배열
let wallArr = [];


start.addEventListener('click', function () {

    start.remove();
    bg1.style.display = 'none';

    function gameLoop() {
        timer++;

        if (timer % lvlSpeedFrame === 0) {
            moveWall();
        }

        // 벽 이동
        wallArr.forEach((wall, index) => {
            wall.move();  // 각 벽이 이동
            if (wall.right > gameContainer.offsetWidth) {
                gameContainer.removeChild(wall.element);
                wallArr.splice(index, 1); // 벽이 화면을 벗어나면 배열에서 제거
            }
        });

        Difficulty();
        jump();

        let frame = requestAnimationFrame(gameLoop);

        // 점수 갱신 (새로운 점수를 얻었을 때)
        wallArr.forEach((wall) => {
            if (!isScore && checkCollision(bird, wall.scoreBlock)) {
                scoreUpdate++;
                score.textContent = `현재 점수 : ${scoreUpdate}`;
                isScore = true;
                setTimeout(() => {
                    isScore = false;
                }, 1000);
            }
        });

        // 게임 오버 조건 (각 벽의 pipe1과 pipe2와 충돌 체크)
        wallArr.forEach((wall) => {
            if (checkCollision(bird, wall.pipe1) || checkCollision(bird, wall.pipe2)) {
                cancelAnimationFrame(frame);
                alert(`벽에 닿았습니다! 게임오버! 
점수 : ${scoreUpdate} 점`);
                bgRe.style.display = 'block';
                bg2.style.display = 'block';
            }
        });
        if (y >= 3000) {
            cancelAnimationFrame(frame);
            alert(`떨어져 죽엇습니다! 게임오버! 
점수 : ${scoreUpdate} 점`);
            bgRe.style.display = 'block';
            bg2.style.display = 'block';
        }
    }

    // 벽 이동 함수
    function moveWall() {
        const newWall = document.createElement("div");
        newWall.classList.add("wall");

        const pipe1 = document.createElement("div");
        pipe1.classList.add("pipe1");

        const pipe2 = document.createElement("div");
        pipe2.classList.add("pipe2");

        const scoreBlock = document.createElement("div");
        scoreBlock.classList.add("scoreBlock");

        newWall.appendChild(pipe1);
        newWall.appendChild(scoreBlock);
        newWall.appendChild(pipe2);

        gameContainer.appendChild(newWall);

        const randomTop = Math.floor(Math.random() * 331) - 400;

        // 벽 객체
        const wall = {
            element: newWall,
            right: -200,  // 벽의 초기 위치
            top: 0, // 랜덤 높이 설정
            pipe1: pipe1,
            pipe2: pipe2,
            scoreBlock: scoreBlock,
            move: function () {
                this.right += lvlGameSpeed;
                this.element.style.right = this.right + "px";
                this.element.style.top = randomTop + "px";
            }
        };

        // 벽 배열에 추가
        wallArr.push(wall);
    }

    // 점프 함수
    function jump() {
        velocity += gravity;      // 중력 적용
        y += velocity;            // 속도에 따라 위치 변경
        bird.style.top = y + "px";
    }

    function Difficulty() {
        if (scoreUpdate === 10) {
            lvlGameSpeed = 2;
        }
        else if (scoreUpdate === 15) {
            lvlGameSpeed = 3;
        }
        else if (scoreUpdate === 20) {
            lvlGameSpeed = 3.5;
        }
        else if (scoreUpdate === 25) {
            lvlSpeedFrame = 240;
            lvlGameSpeed = 4;
        }
        else if (scoreUpdate === 30) {
            lvlGameSpeed = 4.5;
        }
        else if (scoreUpdate === 40) {
            lvlSpeedFrame = 200;
            lvlGameSpeed = 5;
        }
        else if (scoreUpdate === 50) {
            lvlGameSpeed = 5.5;
        }
        else if (scoreUpdate === 60) {
            lvlSpeedFrame = 180;
            lvlGameSpeed = 5.5;
        }
    }

    // 충돌 체크 함수 (각 벽의 pipe1 또는 pipe2와 충돌을 체크하는 부분)
    function checkCollision(rect1, rect2) {
        let rect1Rect = rect1.getBoundingClientRect();
        let rect2Rect = rect2.getBoundingClientRect();

        return (
            rect1Rect.left < rect2Rect.right &&
            rect1Rect.right > rect2Rect.left &&
            rect1Rect.top < rect2Rect.bottom &&
            rect1Rect.bottom > rect2Rect.top
        );
    }

    // 키 입력 처리
    document.addEventListener("keydown", function (e) {
        if (e.code === "Space") {
            velocity = jumpPower;
        }
    });
    bgRe.addEventListener('click', function () {
        location.reload();
    });

    // 게임 루프 시작
    gameLoop();
})

