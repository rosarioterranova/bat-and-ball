// ---- DATA

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
const ballSpeed = 2;

//Paddle
const paddleHeight = 10;
const paddleWidth = 75;
const paddleOffset = 10;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;

//Game Data
let isGameStarted = false;
let score = 0;
let lives = 3;

// ---- INPUTS

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

//Start Button
document.querySelector("#start").addEventListener("click", ()=>{
    if(!isGameStarted){
        draw();
        isGameStarted = true;
        document.querySelector("#start").innerHTML = "Restart"
    } else {
        document.location.reload();
    }
})


// ---- DRAW FUNCTIONS

function drawContext(){
    // Background
    ctx.strokeStyle="#FF0000";
    ctx.fillStyle = "#00FFFF";
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
    ctx.fillText("Score: "+ score, 8, 20);
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
    }

    //bounce up
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > (canvas.height-paddleOffset)-ballRadius) { //bounce down
        if(x > paddleX && x < paddleX + paddleWidth) { //bounce to paddle
            dy = -dy;
            score++;
        }
        else { //bounce to empty
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                restartPosition();
            }
        }
    }

    movePaddle();
    moveBall();
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