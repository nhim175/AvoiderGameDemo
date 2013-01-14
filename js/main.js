var gameCanvas = document.getElementById("gameCanvas");
var avatarImage = new Image();
var enemyImage = new Image();
var ctx = gameCanvas.getContext("2d");
var avatarX = 0;
var avatarY = 0;
var stageWidth = 400;
var stageHeight = 300;
var enemies = [];
var currentEnemyNumber;
var numberOfEnemies;
var speed = 1;
var gameStart = false;
var score = 0;
var highscore;

enemies.push(new enemy());

avatarImage.src = "img/turtle.png";
enemyImage.src = "img/sword.png";

var avatarWidth = 30;
var avatarHeight = 20;
var enemyWidth = 20;
var enemyHeight = 62;

if(localStorage.getItem("highscore")) {
    ctx.fillText("Last highscore: " + localStorage.getItem("highscore"), 200, 100);
}
ctx.fillText("Click to play...", 200, 150);

function setUpGame() {
    highscore = localStorage.getItem("highscore")? localStorage.getItem("highscore") : 0;
    if(gameStart == true) { //prevent hack speed
        return false;
    } else {
        gameStart = true;
    }
    ctx.drawImage(enemyImage, enemies[0].xPos, enemies[0].yPos); //draw first enemy
    gameCanvas.addEventListener("mousemove", handleMouseMovement);
    setInterval(handleTick, 30);
    setInterval(speedUp, 5000);
}

function handleMouseMovement(mouseEvent) {
    avatarX = mouseEvent.offsetX;
    avatarY = mouseEvent.offsetY;
    //if(mouseEvent.offsetX > 100 && mouseEvent.offsetX < 200 && mouseEvent.offsetY > 100 && mouseEvent.offsetY < 200) {
    //   alert("Stay out of the middle!");
    //}
}

function handleTick() { //after a time interval
    //increase score
    score += 1;

    if(Math.random() < 1/10) { //reduce number of enemies
        enemies.push(new enemy());  //create new enemy
    }

    //loop for enemies
    numberOfEnemies = enemies.length;
    //calculate current Y positions
    currentEnemyNumber = 0; //set counter
    while(currentEnemyNumber < numberOfEnemies) {
        if(enemies[currentEnemyNumber].yPos > stageHeight) { //remove out of stage enemies
            enemies.splice(currentEnemyNumber, 1);
        }
        enemies[currentEnemyNumber].yPos += speed;
        currentEnemyNumber += 1;
    }

    gameCanvas.width = 400; //erase the canvas by set its width
    ctx.drawImage(avatarImage, avatarX, avatarY);   //redraw avatarImage
    ctx.fillText("Score: " + score, 300, 10);

    currentEnemyNumber = 0; //rewind counter

    //update enemies' positions
    while(currentEnemyNumber < numberOfEnemies) {
        ctx.drawImage(enemyImage, enemies[currentEnemyNumber].xPos, enemies[currentEnemyNumber].yPos);
        currentEnemyNumber += 1;
    }

    //collision detection
    currentEnemyNumber = 0;
    while(currentEnemyNumber < numberOfEnemies) {
        var enemyX = enemies[currentEnemyNumber].xPos;
        var enemyY = enemies[currentEnemyNumber].yPos;
        var xCollision = (enemyX+7 < avatarX && avatarX < enemyX + enemyWidth-7)||(avatarX < enemyX+7 && enemyX+7 < avatarX + avatarWidth);
        var yCollision = (enemyY < avatarY && avatarY < enemyY + enemyHeight)||(avatarY < enemyY && enemyY < avatarY + avatarHeight);
        if(xCollision&& yCollision) { //if having collision
            if(score > highscore) {
                localStorage.setItem("highscore", score);
            }
            //restart
            enemies = [];
            speed = 1;
            score = 0;
            alert("Game over!");
        }
        currentEnemyNumber += 1;
    }

    //console.log(enemies.length);
}

function enemy() {
    this.xPos = Math.random() * stageWidth;
    this.yPos = 0;
}

function speedUp() {
    speed += 1;
}