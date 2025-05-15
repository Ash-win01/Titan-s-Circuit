const edgeScores = {
    outCorner: [1, 1, 3, 2, 1, 2],
    mainCorner: [5, 6, 4, 5, 6, 4],
    inCorner: [8, 8, 9, 8, 8, 9],
};

const crossEdgeScores = {
    outMainCorner: [1, 1, 1],
    mainInCorner: [1, 1, 1]
}

let ownedEdges = {
    player1: {
    outCorner: [false, false, false, false, false, false],
    mainCorner: [false, false, false, false, false, false],
    inCorner: [false, false, false, false, false, false],
    outMainCorner: [false, false, false],
    mainInCorner: [false, false, false]
    },
    player2: {
    outCorner: [false, false, false, false, false, false],
    mainCorner: [false, false, false, false, false, false],
    inCorner: [false, false, false, false, false, false],
    mainInCorner: [false, false, false],
    outMainCorner: [false, false, false]
    }
};

let player1place = {
    outCorner: [],
    mainCorner: [],
    inCorner: []
};

let player2place = {
    outCorner: [],
    mainCorner: [],
    inCorner: []
};

let moveHistory = [];



let player1Score = 0;
let player2Score = 0;
let firstClick = null;
let winPlayerName;
let winPlayerScore;

let totalSeconds = 300;
let turnSeconds = 20;
let player1Name;
let player2Name;

let mainVertex;
let outVertex;
let inVertex;
let inScore;
let mainScore;
let outScore;

let board = document.getElementById('board');

let centerX = 240;
let centerY = 300;

const gameTimer  = document.getElementById("timer");
const player1Timer = document.getElementById("p1time");
const player2Timer = document.getElementById("p2time");

const hist = document.getElementById("moveHis");
const clickSound = document.getElementById("clickSnd");
const bgMusic = document.getElementById("bgmusic");
const intropgbgm = document.getElementById("intobgm");
const playBt = document.getElementById('playBt');

const inScoreValue = [8, 8, 9, 8, 8, 9];
const mainScoreValue = [5, 6, 4, 5, 6, 4];
const outScoreValue = [1, 1, 3, 2, 1, 2];

if (window.matchMedia("(max-width: 780px)").matches) {
    centerX = window.innerWidth / 2;
    centerY = (window.innerHeight / 2) - 5;
     mainVertex = generatePoints(centerX, centerY, 120);
    outVertex = generatePoints(centerX, centerY, 180);
    inVertex = generatePoints(centerX, centerY, 60);
    inScore = generatePointScore(centerX, centerY, 35);
    mainScore = generatePointScore(centerX, centerY, 85);
    outScore = generatePointScore(centerX, centerY, 135);

} 
else if(window.matchMedia("(min-width: 784px)").matches) {
     mainVertex = generatePoints(centerX, centerY, 150);
    outVertex = generatePoints(centerX, centerY, 225);
    inVertex = generatePoints(centerX, centerY, 75);
    inScore = generatePointScore(centerX, centerY, 45);
   mainScore = generatePointScore(centerX, centerY, 110);
   outScore = generatePointScore(centerX, centerY, 175);
}


generateCorner(mainVertex, "mainCorner");
generateCorner(outVertex, "outCorner");
generateCorner(inVertex, "inCorner");
generateScoreCorner(inScore, inScoreValue);
generateScoreCorner(mainScore, mainScoreValue);
generateScoreCorner(outScore, outScoreValue);

generateEdge(mainVertex, "mainEdge");
generateEdge(outVertex, "outEdge");
generateEdge(inVertex, "inEdge");
generateEdgeCross(mainVertex, inVertex, "mainInEdge");
generateEdgeCrossOut(mainVertex, outVertex, "mainOutEdge");


const player1 = 1;
const player2 = 2;
let currentPlayer = 1;
document.getElementById("pturn").innerText =  "Start The Game!";
let player1Coins = 0;
let player2Coins = 0;
const maxCoins = 4;

let timerInt;
let isRunning = false;
let lastMove = null;

const pauseBt = document.getElementById("pauseBt");
const resumeBt = document.getElementById("resumeBt");
const resetBt = document.getElementById("resetBt");
const undoBt = document.getElementById("undoBt");
const redoBt = document.getElementById("redoBt");



playBt.addEventListener('click', () => {
    startGame();
     clickSound.currentTime = 0;
     clickSound.play();
    intropgbgm.play();
    document.getElementById('pl1Name').innerHTML = player1Name;
    document.getElementById('pl2Name').innerHTML = player2Name;
});




function startGame(){
     player1Name = document.getElementById('player1Name').value.trim();
     player2Name = document.getElementById('player2Name').value.trim();
     

    if(!player1Name || !player2Name){
        alert("Please enter both player names.");
        return;
    }

    window.playername1 = player1Name;
    window.playername2 = player2Name;

    document.getElementById('introPage').style.display = 'none';
    document.getElementById('gamePg').style.display = 'block';

    
}

function generatePoints(cx, cy, r){
    const points=[];
    for(let i=0;i<6;i++){
        const angle = (Math.PI/3) * i;
        const x = cx + r*Math.cos(angle);
        const y = cy + r*Math.sin(angle);
        points.push({x, y});
    }
    return points;
}

function generatePointScore(cx, cy, r){
    const points=[];
    for(let i=0;i<6;i++){
        const angle = (Math.PI/6) * (2*i+1);
        const x = cx + r*Math.cos(angle);
        const y = cy + r*Math.sin(angle);
        points.push({x, y});
    }
    return points;
}


function generateCorner(Vertex, label = "idName"){
Vertex.forEach((point, i) => {
    const corner = document.createElement('div');
    corner.classList.add('corner');

    corner.style.left = `${point.x}px`;
    corner.style.top = `${point.y}px`;
    corner.setAttribute("id", `${label}${i}`);
    board.appendChild(corner);
})
}

function generateScoreCorner(Vertex, value){
    Vertex.forEach((point, i) => {
        const scorediv = document.createElement('div');
        scorediv.classList.add('scorediv');
    
        scorediv.style.left = `${point.x}px`;
        scorediv.style.top = `${point.y}px`;
        scorediv.innerHTML = `${value[i]}`;
    
        board.appendChild(scorediv);
    })
    }

function generateEdge(cornerPoints, vertex){
    for(let i = 0; i<cornerPoints.length; i++){
        const p1 = cornerPoints[i];
        const p2 = cornerPoints[(i+1) % cornerPoints.length];

        const x1 = p1.x;
        const y1 = p1.y;
        const x2 = p2.x;
        const y2 = p2.y;

        const dx = x2 - x1;
        const dy = y2 - y1;

        const length = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const ux = dx/length;
        const uy = dy/length;

        console.log(ux);
        console.log(uy);


        const edge = document.createElement('div');
        edge.classList.add('edge');
        edge.style.left = `${x1+ux*10}px`;
        edge.style.top = `${y1+uy*10}px`;
        edge.style.width = `${length-25}px`;
        edge.style.transform = `rotate(${angle}deg)`;
        edge.style.transformOrigin = '0 0';

        edge.setAttribute("id", `${vertex}${i}`);
        board.appendChild(edge);

    }
}

function generateEdgeCross(cornerPoints1, cornerPoints2, crossEdge){
    for(let i = 0; i<cornerPoints1.length; i++){
        const p1 = cornerPoints1[i];
        const p2 = cornerPoints2[i];

        const x1 = p1.x;
        const y1 = p1.y;
        const x2 = p2.x;
        const y2 = p2.y;

        const dx = x2 - x1;
        const dy = y2 - y1;

        const length = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const ux = dx/length;
        const uy = dy/length;

        console.log(ux);
        console.log(uy);


        const edge = document.createElement('div');
        edge.classList.add('edge');
        edge.style.left = `${x1+ux*10}px`;
        edge.style.top = `${y1+uy*10}px`;
        edge.style.width = `${length-27}px`;
        edge.style.transform = `rotate(${angle}deg)`;
        edge.style.transformOrigin = '0 0';
        
        edge.setAttribute("id", `${crossEdge}${i}`);
        board.appendChild(edge);

        const a = ((x2 + x1)/2);
        const b = ((y2 + y1)/2);

        const dx1 = centerX - a;
        const dy1 = centerY - b;

        const dist = Math.sqrt(dx1*dx1 + dy1*dy1);

        const ux1 = dx1/dist ;
        const uy1 = dy1/dist;

        const score = document.createElement('div');
        score.classList.add('score');
        score.style.left = `${a+ux1*5}px`;
        score.style.top = `${b+uy1*1}px`;
        score.innerHTML = '1';
        board.appendChild(score);
        i=i+1;
    }
}

function generateEdgeCrossOut(cornerPoints1, cornerPoints2, crossEdge){
    for(let i = 0; i<cornerPoints1.length; i++){
        const p1 = cornerPoints1[i+1];
        const p2 = cornerPoints2[i+1];

        const x1 = p1.x;
        const y1 = p1.y;
        const x2 = p2.x;
        const y2 = p2.y;

        const dx = x2 - x1;
        const dy = y2 - y1;

        const length = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const ux = dx/length;
        const uy = dy/length;

        console.log(ux);
        console.log(uy);


        const edge = document.createElement('div');
        edge.classList.add('edge');
        edge.style.left = `${x1+ux*10}px`;
        edge.style.top = `${y1+uy*10}px`;
        edge.style.width = `${length-27}px`;
        edge.style.transform = `rotate(${angle}deg)`;
        edge.style.transformOrigin = '0 0';

        edge.setAttribute("id", `${crossEdge}${i}`);
        board.appendChild(edge);

        const a = ((x2 + x1)/2);
        const b = ((y2 + y1)/2);
        
        const dx1 = centerX - a;
        const dy1 = centerY - b;
        
        const dist = Math.sqrt(dx1*dx1 + dy1*dy1);
        
        const ux1 = dx1/dist ;
        const uy1 = dy1/dist;
        
        const score = document.createElement('div');
        score.classList.add('score');
        score.style.left = `${a+ux1*1}px`;
        score.style.top = `${b+uy1*10}px`;
        score.innerHTML = '1';
        
        board.appendChild(score);

        i=i+1;


    }
}


function enableClick (label, onClick){
    for(let i = 0; i<6; i++){
        const corner = document.getElementById(`${label}${i}`);

        corner.addEventListener('click', ()=>{
            onClick(corner, i, label);
            clickSound.currentTime = 0;
            clickSound.play();
        }, {once:true});
    }
    
}

function onClick(corner, index, label){

    if(corner.classList.contains("Filled") || totalSeconds===0)
        return;

    else if(currentPlayer === 1 && player1Coins<maxCoins){
        corner.style.backgroundColor = "blue";
        player1Coins++;
        player1place[label].push(index);
        corner.classList.add("Filled");
        corner.classList.add("p1titan");
        moveHistory.push({
            type: "place",
            player: player1Name,
            label: label,
            index: index
        });
        updateHist();
        currentPlayer = 2;
        turnSeconds = 20;
        player1Timer.innerText = "20"
        document.getElementById("pturn").innerText = `${player2Name} turn`;

        checkNextLayer(label);
        edgeOwnership(label, player1place, 'player1', index);
        crossEdgeOwnership("mainCorner", "inCorner", player1place, "player1", "mainInCorner");
        crossEdgeOwnership("mainCorner", "outCorner", player1place, "player1", "outMainCorner");
        return;
    }
    else if (currentPlayer === 2 && player2Coins<maxCoins){
        corner.style.backgroundColor = "red";
        player2Coins++;
        player2place[label].push(index);
        corner.classList.add("Filled");
        corner.classList.add("p2titan");
        moveHistory.push({
            type: "place",
            player: player2Name,
            label: label,
            index: index
        });
        updateHist();
        currentPlayer = 1;
        turnSeconds = 20;
        player2Timer.innerText = "20";
        document.getElementById("pturn").innerText = `${player1Name} turn`;

        checkNextLayer(label);
        edgeOwnership(label, player2place, 'player2', index);
        crossEdgeOwnership("mainCorner", "inCorner", player2place, "player2", "mainInCorner");
        crossEdgeOwnership("mainCorner", "outCorner", player2place, "player2", "outMainCorner");
        return;
    } 
}

function checkNextLayer(label){
    if (checkFilled(label) > 5) {
        if (label === "outCorner") {
            enableClick("mainCorner", onClick);
        } else if (label === "mainCorner") {
            enableClick("inCorner", onClick);
            dragTitans("inCorner", dragClick);
        }
        else if(label === "inCorner"){
            alert("Game Over!");
        if(player1Score > player2Score){
            winPlayerName = player1Name;
            winPlayerScore = player1Score;
            saveLeaderboard(winPlayerName, winPlayerScore);
            loadLeaderBoard();
            document.getElementById('pturn').innerText =  `${player1Name} wins`;
            resetBt.innerText = "Restart";
        }
        else if(player2Score > player1Score){
            winPlayerName = player2Name;
            winPlayerScore = player2Score;
            saveLeaderboard(winPlayerName, winPlayerScore);
            loadLeaderBoard();
            document.getElementById('pturn').innerText = `${player2Name} wins.`;
            resetBt.innerText = "Restart";
        }

        }
    }
}

function checkFilled (label){
    let corFilled = 0;
    for(let i = 0; i<6; i++){
        const corner = document.getElementById(`${label}${i}`);

        if(corner.classList.contains("Filled")){
            corFilled++;
        }
    }
    console.log(corFilled);
    return corFilled;
}

function dragTitans(label, dragClick){
    for(let i=0; i<6; i++){
    const corner = document.getElementById(`${label}${i}`);
    corner.addEventListener("click", ()=>{
        dragClick(corner, i, label);
        clickSound.currentTime = 0;
        clickSound.play();
    });
    }
    checkNextLayer(label);
}

function dragClick(corner, index, label){
    if (firstClick === null) {
        if (!corner.classList.contains("Filled")) return;
        firstClick = corner;
        firstClick.dataset.index = index;
        firstClick.dataset.label = label;
    } 
    else {
        const fromIndex = parseInt(firstClick.dataset.index);
        const fromLabel = firstClick.dataset.label;

        if (corner.classList.contains("Filled")) {
            firstClick = null;
            return;
        }

        const validMove = isValidEdgeMove(fromLabel, label, fromIndex, index);
        if (!validMove) {
            alert("Invalid move: not connected by an edge");
            firstClick = null;
            return;
        }

        
        if (currentPlayer === 1) {
            if(firstClick.style.backgroundColor === "red"){
                return;
            }
            corner.style.backgroundColor = "blue";
            corner.style.backgroundImage = "none";
            corner.classList.add("Filled");
            corner.classList.add("p1titan");
            player1place[label].push(index);
        moveHistory.push({
            type: "drag",
            player: player1Name,
            label: label,
            index: index
        });
        updateHist();

            removeIndex(player1place[fromLabel], fromIndex);
            edgeOwnership(fromLabel, player1place, 'player1', fromIndex);
            edgeOwnership(label, player1place, 'player1', index);
            crossEdgeOwnership("mainCorner", "inCorner", player1place, "player1", "mainInCorner");
            crossEdgeOwnership("mainCorner", "outCorner", player1place, "player1", "outMainCorner");
            
        } 
        else {
            if(firstClick.style.backgroundColor === "blue"){
                return;
            }
            corner.style.backgroundColor = "red";
            corner.style.backgroundImage = "none";
            corner.classList.add("Filled");
            player2place[label].push(index);
        moveHistory.push({
            type: "drag",
            player: player2Name,
            label: label,
            index: index
        });
        updateHist();
      
            removeIndex(player2place[fromLabel], fromIndex);
            edgeOwnership(fromLabel, player2place, 'player2', fromIndex);
            edgeOwnership(label, player2place, 'player2', index);
            crossEdgeOwnership("mainCorner", "inCorner", player2place, "player2", "mainInCorner");
            crossEdgeOwnership("mainCorner", "outCorner", player2place, "player2", "outMainCorner");
        }

        
        firstClick.style.backgroundColor = "transparent";
        firstClick.classList.remove("Filled");

        firstClick = null;
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        if(currentPlayer ===1){
            turnSeconds = 20;
            player2Timer.innerText = "20";
        }
        else if (currentPlayer === 2){
            turnSeconds = 20;
            player1Timer.innerText = "20";
        }
        document.getElementById("pturn").innerText = (currentPlayer ===1 ) ? `${player1Name} turn` : `${player2Name} turn`

        checkNextLayer(label);
    }
}

function removeIndex(arr, value) {
    const idx = arr.indexOf(value);
    if (idx !== -1) 
        arr.splice(idx, 1);
}

function isValidEdgeMove(fromLabel, toLabel, fromIndex, toIndex) {
    if (fromLabel === toLabel) {
        return (
            Math.abs(fromIndex - toIndex) === 1 ||
            Math.abs(fromIndex - toIndex) === 5
        );
    }
    return fromIndex === toIndex;
}

function edgeOwnership(label, playerPlace, player){
    const positions = playerPlace[label];
    const edgeArr = edgeScores[label];
    const ownership = ownedEdges[player][label];

    for(let i=0; i<6; i++){
        const a = i;
        const b = (i+1)%6;

        if((positions.includes(a) && positions.includes(b))){
            if(!ownership[i]){
                ownership[i] = true;
               if(player === 'player1'){
                player1Score += edgeArr[i];
                console.log(`Player 1 Score: ${player1Score}`);
                document.getElementById("p1Score").innerText = player1Score;
               }
               else{
                player2Score += edgeArr[i];
                console.log(`Player 2 Score: ${player2Score}`);
                document.getElementById("p2Score").innerHTML = player2Score;
               }
            }
        }
        else if(ownership[i]){
            ownership[i] = false;
            if(player === 'player1'){
                player1Score -= edgeArr[i];
                console.log(`Player 1 Score: ${player1Score}`);
                document.getElementById("p1Score").innerText = player1Score;

            }
            else {
                player2Score -= edgeArr[i];
                console.log(`Player 2 Score: ${player2Score}`);
                document.getElementById("p2Score").innerHTML = player2Score;
            }
        }
    }
}

function crossEdgeOwnership(label1, label2, playerPlace, player, crossLabel){
    const position1 = playerPlace[label1];
    const position2 = playerPlace[label2];
    const ownership = ownedEdges[player][crossLabel];
   
    for(let i=0; i<3; i++){
        let index;
    if(label1 === "mainCorner" && label2 === "outCorner"){
        index = ((2*i)+1);
    }
    else if(label1 === "mainCorner" && label2 === "inCorner"){
         index = (2*i); 
    }
        if((position1.includes(index) && position2.includes(index))){
            if(!ownership[index]){
                ownership[index] = true;
                if(player === "player1"){
                    player1Score += 1;
                    console.log(`Player 1 Score: ${player1Score}`);
                    document.getElementById("p1Score").innerText = player1Score;
                }
                else {
                    player2Score += 1;
                    console.log(`Player 2 Score: ${player2Score}`);
                    document.getElementById("p2Score").innerText = player2Score;
                }
            }
        }
        else if(ownership[index]){
            ownership[index] = false;
                if(player === "player1"){
                    player1Score -= 1;
                    console.log(`Player 1 Score: ${player1Score}`);
                    document.getElementById("p1Score").innerText = player1Score;
                }
                else {
                    player2Score -= 1;
                    console.log(`Player 2 Score: ${player2Score}`);
                    document.getElementById("p2Score").innerText = player2Score;
                }
        }
    }
}
 

function starttimer(){
    if(!isRunning){
        isRunning = true;
   timerInt = setInterval(() => {
    totalSeconds--;
    turnSeconds--;

    const min = Math.floor(totalSeconds/60);
    const seconds = totalSeconds % 60;

    gameTimer.innerText = `00:0${min}:${seconds}`;
    if(currentPlayer === 1){
       player1Timer.innerText = turnSeconds;
    }
    else if(currentPlayer ===2){
      player2Timer.innerText = turnSeconds;
    }

    if(turnSeconds <=0){
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnSeconds = 20;
        document.getElementById("pturn").innerText = (currentPlayer ===1 ) ? `${player1Name} turn` : `${player2Name} turn`
    }
    if(totalSeconds <= 0){
        clearInterval(timerInt);
        gameTimer.innerText = "00:00:00";
        alert("Game over!");
        if(player1Score > player2Score){
            winPlayerName = player1Name;
            winPlayerScore = player1Score;
            saveLeaderboard(winPlayerName, winPlayerScore);
            loadLeaderBoard();
            document.getElementById('pturn').innerText =  `${player1Name} wins`;
            resetBt.innerText = "Restart";
        }
        else if(player2Score > player1Score){
            winPlayerName = player2Name;
            winPlayerScore = player2Score;
            saveLeaderboard(winPlayerName, winPlayerScore);
            loadLeaderBoard();
            document.getElementById('pturn').innerText = `${player2Name} wins.`;
            resetBt.innerText = "Restart";
        }
        
    }   
}, 1000);
}
}

function pauseTimer() {
    if(!isRunning) return;
   clearInterval(timerInt);
   isRunning = false;
}

function resumeTimer(){
    resumeBt.innerText = "Resume";
    starttimer();
}

function resetTimer(){
    resumeBt.innerText = "Start";
    clearInterval(timerInt);
    isRunning = false;
    totalSeconds = 300;
    turnSeconds = 20;
    moveHistory = [];
    updateHist();
    player1Timer.innerText = "20";
    player2Timer.innerText = "20";
    gameTimer.innerText = "00:05:00";
    bgMusic.pause();
    bgMusic.currentTime = 0;
    player1Score = 0;
    document.getElementById("p1Score").innerText = player1Score;
    player2Score = 0;
    currentPlayer = 1;
    document.getElementById("pturn").innerText = `${player1Name} turn`;
    document.getElementById("p2Score").innerText = player2Score;
    resetTitans("outCorner");
    resetTitans("inCorner");
    resetTitans("mainCorner");
     player1place = {
    outCorner: [],
    mainCorner: [],
    inCorner: []
};

   player2place = {
    outCorner: [],
    mainCorner: [],
    inCorner: []
};

ownedEdges = {
    player1: {
    outCorner: [false, false, false, false, false, false],
    mainCorner: [false, false, false, false, false, false],
    inCorner: [false, false, false, false, false, false],
    outMainCorner: [false, false, false],
    mainInCorner: [false, false, false]
    },
    player2: {
    outCorner: [false, false, false, false, false, false],
    mainCorner: [false, false, false, false, false, false],
    inCorner: [false, false, false, false, false, false],
    mainInCorner: [false, false, false],
    outMainCorner: [false, false, false]
    }
};

player1Coins = 0;
player2Coins = 0;
}

function resetTitans(label){
   for(let i = 0; i<6; i++){
        const corner = document.getElementById(`${label}${i}`);
        corner.style.backgroundColor = "transparent";
        corner.classList.remove("Filled");
    }
}




function updateHist(){
hist.innerHTML = moveHistory.map((move, i) => {
    return `<span class="moveLabel">Move ${i+1}:</span> <br> ${move.player} placed titan at ${move.label}[${move.index}]`;
}).join('<br>');
}

function saveLeaderboard(playerName, score){
    let leaderBoard = JSON.parse(localStorage.getItem("leaderboard")) || [];

   leaderBoard.push({name: playerName, score: score});

   leaderBoard.sort((a,b) => b.score - a.score);
   leaderBoard = leaderBoard.slice(0, 10);

   localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));

}

function loadLeaderBoard(){
    const leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];
    const tbody = document.getElementById("lbBody");

    tbody.innerHTML = "";

    leaderBoard.forEach((entry, index) => {
        const row = document.createElement("tr");

        const rank = document.createElement("td");
        rank.innerText = index + 1;

        const pName = document.createElement("td");
        pName.innerText = entry.name;

        const pScore = document.createElement("td");
        pScore.innerText = entry.score;

        row.appendChild(rank);
        row.appendChild(pName);
        row.appendChild(pScore);

        tbody.appendChild(row);
    })
}



if(totalSeconds === 300){
    resumeBt.innerText = "Start";
}
else{
    resumeBt.innerText = "Resume";
}

pauseBt.addEventListener('click', pauseTimer);
resumeBt.addEventListener('click', () => {
    
    if(resumeBt.innerText = "Start"){
    enableClick("outCorner", onClick);}
    bgMusic.play();
    document.getElementById("pturn").innerText = `${player1Name} turn`;
    resumeTimer();
});
resetBt.addEventListener('click', resetTimer);


dragTitans("mainCorner", dragClick);
dragTitans("outCorner", dragClick);



window.onload = function () {
    loadLeaderBoard();
};





