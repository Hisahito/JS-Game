const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemiesPositions= [];


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7
    } else {
        canvasSize = window.innerHeight * 0.7
    };

    canvasSize = Number(canvasSize.toFixed(0));


    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    showLives();
    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI+1);
            const posY = elementsSize * (rowI+1);
            let base_image;

            if( col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                } 
                }else if (col == 'I' && level == 0){
                    giftPosition.x = posX;
                    giftPosition.y = posY;

                    base_image = new Image();
                    base_image.src = "./assets/html5-brands.svg";
                    base_image.onload = function(){
                    game.drawImage(base_image, posX-27, posY-27, elementsSize, elementsSize);
                    
                    }
            } else if (col === 'X'){
                    enemiesPositions.push({x: posX, y: posY});
                    base_image = new Image();
                    base_image.src = "./assets/wonka.png";
                    base_image.onload = function(){
                        game.drawImage(base_image, posX-27, posY-27, elementsSize, elementsSize);
                    }

            } else if (col == 'I' && level == 1){
                    giftPosition.x = posX;
                    giftPosition.y = posY;

                    base_image = new Image();
                    base_image.src = "./assets/css3-brands.svg";
                    base_image.onload = function(){
                    game.drawImage(base_image, posX-27, posY-27, elementsSize, elementsSize);
                    
                }
            } else if (col == 'I' && level == 2){
                    giftPosition.x = posX;
                    giftPosition.y = posY;
                    base_image = new Image();
                    base_image.src = "./assets/js-brands.svg";
                    base_image.onload = function(){
                    game.drawImage(base_image, posX-27, posY-27, elementsSize, elementsSize);
                    
                }
            
            }

            game.fillText(emoji, posX, posY);
        });
    });
    movePlayer();
}
/*
function make_base(){
    base_image = new Image();
    base_image.src = "./assets/html5-brands.svg";
    base_image.onload = function(){
        game.drawImage(base_image, giftPosition.x, giftPosition.y, elementsSize, elementsSize);
    }
}
*/
function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
    if(giftCollision){
        levelWin();
    }

    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if(enemyCollision){
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    
}

function levelWin(){
    level++;
    startGame();
}

function levelFail(){
    lives--;
    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        level = 0;
        startGame()
    
    
}

function gameWin(){
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart

    if(recordTime){
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = `SUPERASTE EL RECORD 🎉👏🏻 <button onclick="location.reload()">Reinicia Ahora!</button><a style="color:white" class="twitter-share-button" href="https://twitter.com/intent/tweet?text=🔥My%20score%20record%20playing%20NOviEsGamE:%20${playerTime}%20milisegundos%20💻%20%20%20%20%20SUPERA%20MI%20RECORD%20AQUI:%20https://hisahito.github.io/JS-Game/%20%20%20%20%20%20&via=hisahitoMX" data-size="large" data-url="https://hisahito.github.io/JS-Game/" data-via="@hisahitoMX" data-hashtag="OracleNextEducation"><i class="fa-brands fa-square-twitter"></i></a> <a style="color:white" class="linkedin-share-button" href="https://linkedin.com/shareArticle?mini=true&url=🔥My%20score%20record%20playing%20NOviEsGamE:%20${playerTime}%20milisegundos%20💻%20%20%20%20%20SUPERA%20MI%20RECORD%20AQUI:%20https://hisahito.github.io/JS-Game/%20%20%20%20%20Creado%20por%20HisahitoMX"><i class="fa-brands fa-linkedin"></i></a>`;
        } else {
            pResult.innerHTML = `Lo Siento, NO superaste el Record 🤌🏻 <button onclick="location.reload()">Reinicia Ahora!</button><a style="color:white" class="twitter-share-button" href="https://twitter.com/intent/tweet?text=🔥My%20score%20record%20playing%20NOviEsGamE:%20${playerTime}%20milisegundos%20💻%20%20%20%20%20SUPERA%20MI%20RECORD%20AQUI:%20https://hisahito.github.io/JS-Game/%20%20%20%20%20%20&via=hisahitoMX" data-size="large" data-url="https://hisahito.github.io/JS-Game/" data-via="@hisahitoMX" data-hashtag="OracleNextEducation"><i class="fa-brands fa-square-twitter"></i></a> <a style="color:white" class="linkedin-share-button" href="https://linkedin.com/shareArticle?mini=true&url=🔥My%20score%20record%20playing%20NOviEsGamE:%20${playerTime}%20milisegundos%20💻%20%20%20%20%20SUPERA%20MI%20RECORD%20AQUI:%20https://hisahito.github.io/JS-Game/%20%20%20%20%20Creado%20por%20HisahitoMX"><i class="fa-brands fa-linkedin"></i></a>`;
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = `Primera Vez? Muy Bien, ahora trata de superar tu tiempo. 🫡 <button onclick="location.reload()">Reinicia Ahora!</button>`;
    }
}

function showLives(){
    const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = '';
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
    if(event.code == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();   
}

function moveUp(){
    if((playerPosition.y - elementsSize) < elementsSize){
        console.log('OUT');
    }else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft(){
    if((playerPosition.x - elementsSize) < elementsSize){
        console.log('OUT');
    }else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}


function moveRight(){
    if((playerPosition.x + elementsSize) > canvasSize){
        console.log('OUT');
    }else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown(){
    if((playerPosition.y + elementsSize) > canvasSize){
        console.log('OUT');
    }else {
        playerPosition.y += elementsSize;
        startGame();
    } 
}
