// ---------------- DATA

//Canvas
const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext("2d");

//Ball
const ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let ballSpeed = 1;

//Paddle
const paddleHeight = 10;
const paddleWidth = 75;
const paddleOffset = 10;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;

//Game Data
let isGameStarted = false;
let isGamePlaying = false;
let score = 0;
let totalScore = 0;
let scoreToPassLevel = 3;
let lives = 3;
let level = 1;
const startBtn = document.querySelector("#start");
const levelDetail = document.querySelector("#level")
const ballSpeedDetail = document.querySelector("#ballSpeed")
const totalScoreDetail = document.querySelector("#totalScore")
const livesDetail = document.querySelector("#lives")

drawMessage("🏁 Press start to play");

// ---------------- INPUTS

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "ArrowRight")
        rightPressed = true;
    else if(e.key == "ArrowLeft")
        leftPressed = true;
}

function keyUpHandler(e) {
    if(e.key == "ArrowRight")
        rightPressed = false;
    else if(e.key == "ArrowLeft")
        leftPressed = false;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

// ---------------- LOGIC

startBtn.addEventListener("click", ()=> startGame())

function startGame(){
    if(!isGameStarted){
        isGameStarted = true;
        startBtn.innerHTML = "Restart"
        const audio = new Audio('./audio/start.ogg');
        audio.play();
        gameManager();
    } else {
        document.location.reload();
    }
}

async function gameManager(){
    updateDetails()
    await drawMessage(level === 1? `🏏 Get ready! hit ${scoreToPassLevel} score` : `☝️ Next level! hit ${scoreToPassLevel} score`, "#34eb74");
    isGamePlaying = true;
    draw()
}

function updateDetails(){
    levelDetail.innerHTML = level;
    ballSpeedDetail.innerHTML = ballSpeed;
    totalScoreDetail.innerHTML = totalScore;
    livesDetail.innerHTML = lives;
}

function nextLevel(){
    isGamePlaying = false;
    const audio = new Audio('./audio/next.mp3');
    audio.play();

    scoreToPassLevel++;
    totalScore += score;
    score = 0;
    ballSpeed +=1;
    level++;
    gameManager();
}

async function lifeLoss(){
    isGamePlaying = false
    const audio = new Audio('./audio/lifeLoss.wav');
    audio.play();
    await drawMessage("You lost 1 life 😥", "#f7393f");
    lives--;
    if(!lives) {
        const audio = new Audio('./audio/game-over.wav');
        audio.play();
        await drawMessage("💀 GAME OVER", "#f7393f", null)
    }
    else {
        restartPosition();
        isGamePlaying = true
        draw()
    }
    updateDetails();
}

function drawMessage(message="message", backgroundColor="#00FFFF"){
    drawContext(backgroundColor);
    ctx.font = "16px cursive";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width/2, canvas.height/2);
    return new Promise(resolve => setTimeout(resolve, 3000))

}

function playRandomBounce(){
    const audio = new Audio(`./audio/bounces/${Math.floor(Math.random() * 4) + 1}.mp3`);
    audio.play();
}

// ---------------- DRAW FUNCTIONS

function drawContext(color="#00FFFF"){
    // Background
    ctx.strokeStyle="#FF0000";
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Borders
    ctx.lineWidth = 4;
    ctx.strokeStyle="#FF0000";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);//for white background

    //Line bottom
    ctx.lineWidth = 4;
    ctx.strokeStyle="#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight-paddleOffset, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px cursive";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: "+ score, 40, 20);
}

function drawLives() {
    ctx.font = "16px cursive";
    ctx.fillStyle = "#000000";
    ctx.fillText("Lives: "+ lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawContext();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    //bounce right and left
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        playRandomBounce();
    }

    //bounce up
    if(y + dy < ballRadius) {
        dy = -dy;
        playRandomBounce();
    }
    else if(y + dy > (canvas.height-paddleOffset)-ballRadius) { //bounce down
        if(x > paddleX && x < paddleX + paddleWidth) { //bounce to paddle
            if(x > paddleX + paddleWidth/2){
                dx = Math.abs(dx);
            } else{
                dx = Math.abs(dx) * -1;
            }
            dy = -dy;
            playRandomBounce();
            score++;
            if(score === scoreToPassLevel)
                nextLevel()
        }
        else { //bounce to empty
            lifeLoss()
        }
    }

    movePaddle();
    moveBall();
    if(isGamePlaying)
        requestAnimationFrame(draw); //https://stackoverflow.com/questions/38709923/why-is-requestanimationframe-better-than-setinterval-or-settimeout
}

function restartPosition(){
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width-paddleWidth)/2;
}

function movePaddle(){
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

function moveBall(){
    x += dx * ballSpeed;
    y += dy * ballSpeed;
}
