/**
 * Created by Elcina on 10/1/2016.
 */
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

const SPACE = 120; //space between two dots
const START = 100; //starting x and y coordinates
const LEN = 4;  // size of dot matrix
const RADIUS = 5; //dot radius
const NUMOFPLAYERS = 2; //number of players
/*var enabledES6 = function () {
    "use strict";
    try {
        eval("var foo = (x)=>x+1");
    }
    catch (e) {
        return false;
    }
    return true;
};

if (enabledES6) {
 class Point
 {
 constructor(xpos, ypos, up, down, left, right)
 {
 this.xpos = xpos;
 this.ypos = ypos;
 this.up = up;
 this.down = down;
 this.left = left;
 this.right = right;
 }
 }
 } */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var Player = function (number) {
    this.number = number;
    this.squares = 0;
    this.color = getRandomColor();
};

//nextPlayer function is to select player for next round based on player.number
function nextPlayer(){
    if (currPlayer.number/(playerArr.length-1) ==1) {
        currPlayer =  playerArr[0];
    } else {
        currPlayer =  playerArr[currPlayer.number+1];
    }
    setTimeout(function() {
        document.getElementById('turnHeader').innerHTML = "PLAYER "+(currPlayer.number+1)+" TURN";
    }, 200);

}

//Initialize Player Array
var playerArr = [];
for(var i =0 ; i < NUMOFPLAYERS; i++) {
    playerArr.push(new Player(i));
}
//Set Current Player to first Player
var currPlayer =  playerArr[0];

var Point = function (xpos, ypos, up, down, left, right) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
};

var gameArr = [];
buildGrid();
function buildGrid() {
    var xPosition = START;
    var yPosition = START;
    for (var i = 0; i < LEN; i++) {
        var inArr = [];
        xPosition = START;
        for (var j = 0; j < LEN; j++) {
            inArr[j] = new Point(xPosition, yPosition, 0, 0, 0, 0);
            xPosition += SPACE;
        }
        yPosition += SPACE;
        gameArr.push(inArr);
    }
}

function drawDots() {
    for (var i = 0; i < LEN; i++) {
        for (var j = 0; j < LEN; j++) {
            ctx.beginPath();
            ctx.arc(gameArr[i][j].xpos, gameArr[i][j].ypos, RADIUS, 0, 2 * Math.PI, true);
            ctx.fill();
        }
    }
}

function drawLines(x, y) {
    var lineDrawn = false;
    var squareCompleted = false;
    for (var i = 0; i < LEN - 1; i++) {
        if (gameArr[i][0].ypos < y && gameArr[i + 1][0].ypos > y) {
            for (var j = 0; j < LEN; j++) {
                if (x >= gameArr[0][j].xpos - 2 * RADIUS && x <= gameArr[0][j].xpos + 2 * RADIUS) {
                    if (gameArr[i][j].down || gameArr[i + 1][j].up) {
                        alert("line already exists!!!");
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(gameArr[0][j].xpos, gameArr[i][0].ypos);
                        ctx.lineTo(gameArr[0][j].xpos, gameArr[i + 1][0].ypos);
                        ctx.strokeStyle = currPlayer.color;
                        ctx.stroke();
                        lineDrawn = true;
                        //console.log("line:",i,j,"to",i+1,j);
                        gameArr[i][j].down = 1;
                        gameArr[i + 1][j].up = 1;
                        squareCompleted = checkSquare(i,j,i+1,j,"vert");
                        break;
                    }
                }
            }
        }
        if (gameArr[0][i].xpos < x && gameArr[0][i + 1].xpos > x) {
            for (var k = 0; k < LEN; k++) {
                if (y >= gameArr[k][0].ypos - 2 * RADIUS && y <= gameArr[k][0].ypos + 2 * RADIUS) {
                    if (gameArr[k][i].right || gameArr[k][i + 1].left) {
                        alert("line already exists!!!");
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(gameArr[0][i].xpos, gameArr[k][0].ypos);
                        ctx.lineTo(gameArr[0][i + 1].xpos, gameArr[k][0].ypos);
                        ctx.strokeStyle = currPlayer.color;
                        ctx.stroke();
                        lineDrawn = true;
                        //console.log("line:",k,i,"to",k,i+1);
                        gameArr[k][i].right = 1;
                        gameArr[k][i + 1].left = 1;
                        squareCompleted = checkSquare(k,i,k,i+1,"hor");
                        break;
                    }
                }
            }
        }
    }
    //If Line is drawn but no square was completed then its next players turn
    checkGameComplete();
    if(lineDrawn && !squareCompleted){
        nextPlayer();
    }
}

function checkGameComplete() {
    var totalSqr = Math.pow(LEN-1,2);
    var sqrCompleted = playerArr.reduce(function (prev, curr) {
        return {x: prev.squares + curr.squares}; // returns object with property x
    });
    console.log("total Squares : ",totalSqr);
    console.log("Squares completed: ",sqrCompleted.x);
    if(sqrCompleted.x == totalSqr){
        var playerMaxSqr = playerArr.reduce(function(prev, curr) {
            return (prev.squares > curr.squares) ? prev : curr
        });
        canvas.removeEventListener("mousedown", getPosition);
        setTimeout(function() {
            ctx.fillStyle = "#d3d9e2";
            ctx.fillRect(170,170,300,50);
            ctx.fillStyle = "black";
            ctx.font = "bold 25px Arial";
            ctx.fillText("PLAYER "+(playerMaxSqr.number+1)+" WON !!!", 200, 200);
            document.getElementById('turnHeader').innerHTML = "PLAYER "+(playerMaxSqr.number+1)+" WON !!!";
        }, 200);
    }

}

function checkSquare(x1,y1,x2,y2,dir){
    var squareCompleted = false;
    if(dir == "vert"){
        if(gameArr[x1][y1].left && gameArr[x2][y2].left && gameArr[x1][y1-1].down) {
            currPlayer.squares++;
            ctx.fillStyle = currPlayer.color;
            ctx.fillRect(gameArr[x1][y1-1].xpos+1,gameArr[x1][y1-1].ypos+1, SPACE-1, SPACE-1);
            squareCompleted = true;
        }
        if(gameArr[x1][y1].right && gameArr[x2][y2].right && gameArr[x1][y1+1].down) {
            currPlayer.squares++;
            ctx.fillStyle = currPlayer.color;
            ctx.fillRect(gameArr[x1][y1].xpos+1,gameArr[x1][y1].ypos+1, SPACE-1, SPACE-1);
            squareCompleted = true;
        }
    } else if(dir == "hor") {
        if(gameArr[x1][y1].up && gameArr[x2][y2].up && gameArr[x1-1][y1].right) {
            currPlayer.squares++;
            ctx.fillStyle = currPlayer.color;
            ctx.fillRect(gameArr[x1-1][y1].xpos+1,gameArr[x1-1][y1].ypos+1, SPACE-1, SPACE-1);
            squareCompleted = true;
        }
        if(gameArr[x1][y1].down && gameArr[x2][y2].down && gameArr[x1+1][y1].right) {
            currPlayer.squares++;
            ctx.fillStyle = currPlayer.color;
            ctx.fillRect(gameArr[x1][y1].xpos+1,gameArr[x1][y1].ypos+1, SPACE-1, SPACE-1);
            squareCompleted = true;
        }
    }
    return squareCompleted;
}

function getPosition(event) {
    var x,y;

    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    }
    else // Firefox method to get the position
    {
        x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    console.log("x: " + x + "  y: " + y);
    drawLines(x, y);
}

window.onload = function (e) {
    drawDots();
    canvas.addEventListener("mousedown", getPosition, false);
}