let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let geschwindigkeit = 140;
let direction = "right";
const spalten = 15;
const zeilen = 15;
const spaltenbreite = canvas.width / spalten;
const zeilenhöhe = canvas.height / zeilen;
let snake = [{ x: 9, y: 9 }];
let food;
let foodCollected = false;
let refresh;
let score = 0;
let scoreOutput = document.querySelectorAll(".score");
let highscoreOutput = document.querySelectorAll(".highscore");
let finger = new Array();
let xDifferenz, yDifferenz, dataX, dataY, xDifferenz_abs, yDifferenz_abs;

highscoreOutput.forEach((value) => (value.innerText = "Highscore: " + cookie(score)));

document.addEventListener("keydown", keydown);
document.addEventListener("touchmove", touch, { passive: false });
document.addEventListener("touchend", touchend, { passive: false });

function draw() {
   //Hintergrund
   ctx.fillStyle = "black";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   //Snake
   ctx.fillStyle = "blue";
   snake.forEach((part) => add(part.x, part.y));

   //food
   ctx.fillStyle = "red";
   add(food.x, food.y);

   requestAnimationFrame(draw);
}
function testGameOver() {
   let firstPart = snake[0];
   let otherParts = snake.slice(1);
   let duplicate = otherParts.find((part) => part.x == firstPart.x && part.y == firstPart.y);
   //1. gegen Wand
   if (snake[0].x < 0 || snake[0].x > spalten - 1 || snake[0].y < 0 || snake[0].y > zeilen - 1 || duplicate) {
      clearInterval(refresh);
      if (score == cookie(score)) document.getElementById("neu_highscore").innerText = "Neuer Highscore!!";
      else document.getElementById("neu_highscore").innerText = "";
      document.getElementById("dialog").show();
   }
}
function add(x, y) {
   ctx.fillRect(x * spaltenbreite, y * zeilenhöhe, spaltenbreite - 2, zeilenhöhe - 2);
}
function shiftSnake() {
   for (let i = snake.length - 1; i > 0; i--) {
      const part = snake[i];
      const lastPart = snake[i - 1];
      part.x = lastPart.x;
      part.y = lastPart.y;
   }
}
function gameLoop() {
   testGameOver();
   if (foodCollected) {
      snake = [
         {
            x: snake[0].x,
            y: snake[0].y,
         },
         ...snake,
      ];

      foodCollected = false;
   }
   shiftSnake();
   if (direction == "left") snake[0].x--;
   if (direction == "right") snake[0].x++;
   if (direction == "up") snake[0].y--;
   if (direction == "down") snake[0].y++;

   if (snake[0].x == food.x && snake[0].y == food.y) {
      foodCollected = true;
      score++;
      scoreOutput.forEach((value) => (value.innerText = "Score: " + score));
      highscoreOutput.forEach((value) => (value.innerText = "Highscore: " + cookie(score)));
      placeFood();
   }
}

function keydown(e) {
   let taste = e.key.toLowerCase();

   if (taste == "w" || e.key == "ArrowUp") direction = "up";
   if (taste == "a" || e.key == "ArrowLeft") direction = "left";
   if (taste == "s" || e.key == "ArrowDown") direction = "down";
   if (taste == "d" || e.key == "ArrowRight") direction = "right";
   if (taste == "+") start();
}

function placeFood() {
   do {
      var randomX = Math.floor(Math.random() * spalten);
      var randomY = Math.floor(Math.random() * zeilen);
   } while (spawn(randomX, randomY));

   food = { x: randomX, y: randomY };
}

function spawn(xValue, yValue) {
   let rückgabe = false;
   snake.forEach((item) => {
      let teilVonSnake = JSON.stringify(item);
      let spawnPos = '{"x":' + xValue + ',"y":' + yValue + "}";

      if (teilVonSnake == spawnPos) {
         console.log("auf snake");
         rückgabe = true;
      }
   });
   if (rückgabe == true) return true;
   else return false;
}
function start() {
   document.getElementById("dialog").close();
   placeFood();
   direction = "right";
   snake = [{ x: 9, y: 9 }];
   score = 0;
   scoreOutput.forEach((value) => (value.innerText = "Score: " + score));
   highscoreOutput.forEach((value) => (value.innerText = "Highscore: " + cookie(score)));
   refresh = setInterval(gameLoop, geschwindigkeit);
   draw();
}
function cookie(score) {
   //checken if counter > cookie highscore
   //falls ja, dann cookie highscore neu setzen
   let cookie1 = document.cookie.split("=");
   let highscore = parseInt(cookie1[1]);
   const d = new Date();
   d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
   let expires = "expires=" + d.toUTCString();
   if (isNaN(highscore)) {
      highscore = 0;
   }
   if (score > highscore) {
      document.cookie = "better_highscore=" + score + "; SameSite=None; Secure; " + expires;
      return score;
   }
   return highscore;
}
function downloadCanvas() {
   //Spielstand auf Canvas schreiben
   ctx.fillStyle = "white";
   ctx.font = "25px Major Mono Display";
   ctx.fillText("better snake", 15, 30);
   ctx.fillText("score: " + score, 15, 55);
   // Convert our canvas to a data URL
   let canvasUrl = canvas.toDataURL();
   // Create an anchor, and set the href value to our data URL
   const createEl = document.createElement("a");
   createEl.href = canvasUrl;

   // This is the name of our downloaded file
   createEl.download = "better_snake_screenshot_" + score;

   // Click the download button, causing a download, and then remove it
   createEl.click();
   createEl.remove();
}
function touch(event) {
   event.preventDefault();
   //console.log(event.touches, event.type);
   //console.log(event.touches);
   dataX = event.touches[0].pageX;
   dataY = event.touches[0].pageY;

   finger = [
      {
         x: dataX,
         y: dataY,
      },
      ...finger,
   ];
   xDifferenz = finger[0].x - finger[finger.length - 1].x;
   yDifferenz = finger[0].y - finger[finger.length - 1].y;

   xDifferenz_abs = Math.abs(xDifferenz);
   yDifferenz_abs = Math.abs(yDifferenz);

   if (xDifferenz < 0 && xDifferenz_abs > yDifferenz_abs) direction = "left";
   else if (xDifferenz > 0 && xDifferenz_abs > yDifferenz_abs) direction = "right";
   else if (yDifferenz < 0 && yDifferenz_abs > xDifferenz_abs) direction = "up";
   else if (yDifferenz > 0 && yDifferenz_abs > xDifferenz_abs) direction = "down";
}
function touchend(event) {
   finger.length = 0;
   console.log(direction);
}
