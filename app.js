let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let geschwindigkeit = 100;
let direction = "right";
const spalten = 21;
const zeilen = 21;
const spaltenbreite = canvas.width / spalten;
const zeilenhöhe = canvas.height / zeilen;
let snake = [{ x: 9, y: 9 }];
let food;
let foodCollected = false;

document.addEventListener("keydown", keydown);

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
      placeFood();
      snake = [{ x: 9, y: 9 }];
      direction = "right";
   }
   //2. in sich selbst
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
      placeFood();
   }
}

function keydown(e) {
   let taste = e.key.toLowerCase();

   if (taste == "w" || e.key == "ArrowUp") direction = "up";
   if (taste == "a" || e.key == "ArrowLeft") direction = "left";
   if (taste == "s" || e.key == "ArrowDown") direction = "down";
   if (taste == "d" || e.key == "ArrowRight") direction = "right";
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
   placeFood();
   setInterval(gameLoop, geschwindigkeit);
   draw();
}
