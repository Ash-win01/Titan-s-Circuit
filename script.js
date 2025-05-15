console.log("Hi Ashwin");

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

const gameTimer  = document.getElementById("timer");
const player1Timer = document.getElementById("p1time");
const player2Timer = document.getElementById("p2time");

const hist = document.getElementById("moveHis");
const clickSound = document.getElementById("clickSnd");
const bgMusic = document.getElementById("bgmusic");
const intropgbgm = document.getElementById("intobgm");
const playBt = document.getElementById('playBt');

playBt.addEventListener('click', () => {
    startGame();
     clickSound.currentTime = 0;
     clickSound.play();
    intropgbgm.play();
    document.getElementById('pl1Name').innerHTML = player1Name;
    document.getElementById('pl2Name').innerHTML = player2Name;
});

let board = document.getElementById('board');

let centerX = 240;
let centerY = 300;






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
    

    // corner.addEventListener("click", () => {
    //     console.log(`${label}${i} clicked`);
    //     corner.style.backgroundColor = "red";
    // });

    board.appendChild(corner);
})
}

function generateScoreCorner(Vertex, value){
    Vertex.forEach((point, i) => {
        // const scorediv = document.createElement('div');
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
// score.style.transform = `rotate(${angle}deg)`;
// score.style.transformOrigin = '0 0';
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
        // score.style.transform = `rotate(${angle}deg)`;
        // score.style.transformOrigin = '0 0';
        score.innerHTML = '1';
        
        board.appendChild(score);

        i=i+1;


    }
}

let mainVertex;
let outVertex;
let inVertex;
let inScore;
let mainScore;
let outScore;

// const mainVertex = generatePoints(centerX, centerY, 150);
// const outVertex = generatePoints(centerX, centerY, 225);
// const inVertex = generatePoints(centerX, centerY, 75);


// const inScore = generatePointScore(centerX, centerY, 45);
// const mainScore = generatePointScore(centerX, centerY, 110);
// const outScore = generatePointScore(centerX, centerY, 175);

if (window.matchMedia("(max-width: 780px)").matches) {
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
     mainVertex = generatePoints(centerX, centerY, 120);
    outVertex = generatePoints(centerX, centerY, 180);
    inVertex = generatePoints(centerX, centerY, 60);
    inScore = generatePointScore(centerX, centerY, 35);
    mainScore = generatePointScore(centerX, centerY, 85);
    outScore = generatePointScore(centerX, centerY, 135);
//   document.getElementById("myElement").style.display = "none";
} 
else if(window.matchMedia("(min-width: 784px)").matches) {
     mainVertex = generatePoints(centerX, centerY, 150);
    outVertex = generatePoints(centerX, centerY, 225);
    inVertex = generatePoints(centerX, centerY, 75);
    inScore = generatePointScore(centerX, centerY, 45);
   mainScore = generatePointScore(centerX, centerY, 110);
   outScore = generatePointScore(centerX, centerY, 175);
//   document.getElementById("myElement").style.display = "block";
}

const inScoreValue = [8, 8, 9, 8, 8, 9];
const mainScoreValue = [5, 6, 4, 5, 6, 4];
const outScoreValue = [1, 1, 3, 2, 1, 2];

// const crossValue = 1;

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

// game Play

const player1 = 1;
const player2 = 2;
let currentPlayer = 1;
document.getElementById("pturn").innerText =  "Start The Game!";
let player1Coins = 0;
let player2Coins = 0;
const maxCoins = 4;

function enableClick (label, onClick){
    for(let i = 0; i<6; i++){
        const corner = document.getElementById(`${label}${i}`);

        corner.addEventListener('click', ()=>{
            onClick(corner, i, label);
            clickSound.currentTime = 0;
            clickSound.play();
        }, {once:true});
    }
    // if(checkFilled("outCorner")===5){
    //     enableClick("mainCorner", onClick);
    // }
    // if(checkFilled("mainCorner")===5){
    //     enableClick("inCorner", onClick);
    // }
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
        // addScore(label, index, player1place);
        // undoBt.addEventListener('click', ()=>{
        //     undoMove(corner, label);
        // });
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
        // crossEdgeOwnership(player1place, "currentPlayer");
        crossEdgeOwnership("mainCorner", "inCorner", player1place, "player1", "mainInCorner");
        crossEdgeOwnership("mainCorner", "outCorner", player1place, "player1", "outMainCorner");
        // titanEliminate(label, player1place, 'player1', corner);
        return;
    }
    else if (currentPlayer === 2 && player2Coins<maxCoins){
        // corner.style.backgroundColor = "red";
        // corner.style.backgroundImage = "none";
        corner.style.backgroundColor = "red";
        player2Coins++;
        player2place[label].push(index);
        corner.classList.add("Filled");
        corner.classList.add("p2titan");
        // addScore(label, index, player2place);
        // undoBt.addEventListener('click', ()=>{
        //     undoMove(corner, label);
        // });
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
        // titanEliminate(label, player2place, 'player2', corner);
        // crossEdgeOwnership(player2place, "player2");

    //     if (checkFilled(label) > 5) {
    //     if (label === "outCorner") {
    //        crossEdgeOwnership("mainCorner", "inCorner", player2place, "player2", "mainInCorner");
    //     } else if (label === "mainCorner") {
    //         crossEdgeOwnership("mainCorner", "outCorner", player2place, "player2", "outMainCorner");
    //     }
    // }
       
        
        return;
    } 
}

function checkNextLayer(label){
    // if(label==="mainCorner" || label==="inCorner"){
    //     // alert("Locked!");
    // }
    if (checkFilled(label) > 5) {
        if (label === "outCorner") {
            enableClick("mainCorner", onClick);
        // if(label==="inCorner"){
        //     // alert("Locked!");
        // }
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
    // else if(label === "outCorner"){
    //     return;
    // }
    // else{
    //     // alert("Locked!!!");
    // }
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

        // Prevent same coin from moving to a filled spot
        if (corner.classList.contains("Filled")) {
            firstClick = null;
            return;
        }

        // Validate edge connection
        const validMove = isValidEdgeMove(fromLabel, label, fromIndex, index);
        if (!validMove) {
            alert("Invalid move: not connected by an edge");
            firstClick = null;
            return;
        }

        // Move logic
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

        // Clear source
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
        // Only adjacent indices are allowed (including wraparound)
        return (
            Math.abs(fromIndex - toIndex) === 1 ||
            Math.abs(fromIndex - toIndex) === 5
        );
    }

    // Cross-edge connection (in-out / main-out / in-main)
    // All indexes are matched by position
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
 
// function titanEliminate(label, playerPlace, player, corner){
//     const position = playerPlace[label];
//     //  const edgeArr = edgeScores[label];
//     const ownership = ownedEdges[player][label];

//     let playerPos = playerPlace === player1place ? player2place : player1place;

//     for(let i = 0; i<6; i++){
//         const a = i;
//         const b = (i+1)%6;
//         const c = i === 0 ? (i+1) : (i-1);
        
//       if(position.includes(a)){
//          if((position.includes(b) && position.includes(c))){
//             return;
//          }
//          else if(playerPos[label].includes(b) && playerPos[label].includes(c)){
//             ownership[i] = false;
//             corner.style.backgroundColor = "transparent";
//             // corner.classList.remove = "Filled";
//          }
//       }
//       else {
//         return;
//       }
        
//     }
// }

function titanEliminate(label, playerPlace, player, corner) {
    const position = playerPlace[label]; // e.g., [0, 2, 3]
    const ownership = ownedEdges[player][label]; // e.g., [true, true, false, false, ...]

    // Get index from the ID of the corner (format: label + i)
    const id = corner.id;
    const i = parseInt(id.replace(label, '')); // Extract index from "label3" -> 3

    if (isNaN(i)) {
        console.error("Invalid corner index from ID:", id);
        return;
    }

    const a = i;
    const b = (i + 1) % 6;
    const c = (i - 1 + 6) % 6;

    // Ensure the player owns this corner
    if (!position.includes(a)) return;

    const ownsNeighbors = position.includes(b) && position.includes(c);
    const opponentPlace = playerPlace === player1place ? player2place : player1place;
    const opponentNeighbors = opponentPlace[label];

    const opponentOwnsNeighbors = opponentNeighbors.includes(b) && opponentNeighbors.includes(c);

    if (ownsNeighbors) {
        // Player controls this triad — do nothing
        return;
    }

    if (opponentOwnsNeighbors) {
        // Eliminate player's control over this corner
        const idx = position.indexOf(a);
        if (idx !== -1) position.splice(idx, 1); // Remove from player's array
        ownership[i] = false;

        // Remove visuals
        corner.style.backgroundColor = "transparent";
        corner.classList.remove("Filled");
        corner.classList.remove("p1titan");
        corner.classList.remove("p2titan");
    }
}



let timerInt;
let isRunning = false;

function starttimer(){
    if(!isRunning){
        isRunning = true;
   timerInt = setInterval(() => {
    totalSeconds--;
    turnSeconds--;

    const min = Math.floor(totalSeconds/60);
    const seconds = totalSeconds % 60;

    // gameTimer.innerText = `Time Left: ${min.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    gameTimer.innerText = `00:0${min}:${seconds}`;
    if(currentPlayer === 1){
       player1Timer.innerText = turnSeconds;
    }
    else if(currentPlayer ===2){
      player2Timer.innerText = turnSeconds;
    }

    if(turnSeconds <=0){
        // alert("Time up! You missed your turn!");
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

let lastMove = null;

// function undoMove() {
//     if (moveHistory.length === 0) return;

//     lastMove = moveHistory.pop();
//     const undoPlayer = lastMove.player;
//     const undoLabel = lastMove.label;
//     const undoIndex = lastMove.index;

//     const playerPlace = undoPlayer === "player1" ? player1place : player2place;
//     // const playerCoins = player === "Player1" ? 'player1Coins' : 'player2Coins';
    
//     playerPlace[undoLabel] = playerPlace[undoLabel].filter(i => i != undoIndex);
//     if (undoPlayer === "player1") {
//         player1Coins--;
//     } else {
//         player2Coins--;
//     }

//     removeEdgeOwnership(undoLabel, playerPlace, undoPlayer, undoIndex);

//     const cornerElement = document.getElementById(`${undoLabel}${undoIndex}`);
    
//     if (cornerElement) {
//         cornerElement.style.backgroundColor = "transparent";
//         cornerElement.classList.remove("Filled");
//     }

//     cornerElement.addEventListener('click', () => {
//     onClick(cornerElement, undoIndex, undoLabel);
//     clickSound.currentTime = 0;
//     clickSound.play();}, { once: true });

//     updateHist();
//     currentPlayer = currentPlayer === 1 ? 2 : 1;
//     turnSeconds = 20;
//     player1Timer.innerText = "20";
//     document.getElementById('pturn').innerText = `Player ${currentPlayer} turn!`;
// }

// function dragUndo() {
//     if(moveHistory.length === 0) return;

//     const lastMove = moveHistory.pop();
//     const dmPlayer = lastMove.player;
//     const from = lastMove.from;
//     const to = lastMove.to;

//     const playerPlace = dmPlayer === "player1" ? player1place : player2place;

//     const toCorner = document.getElementById(`${from.label}${from.index}`);
//     toCorner.style.backgroundColor = "transparent";
//     toCorner.classList.remove("Filled");

//     const fromCorner = document.getElementById(`${to.label}${to.index}`);
//     fromCorner.style.backgroundColor = (dmPlayer === "player1") ? "blue" : "red";
//     fromCorner.classList.add("Filled");

//     removeIndex(playerPlace[to.label], to.index);
//     playerPlace[from.label].push(from.index);

//     removeEdgeOwnership(to.label, playerPlace, dmPlayer, to.index);
//     addEdgeOwnership(from.label, playerPlace, dmPlayer, from.index);

//     currentPlayer = currentPlayer=== 1 ? 2 : 1;
//     document.getElementById('pturn').innerText = `Player ${currentPlayer} turn.`;
// }

// function handleUndo() {
//     if (moveHistory.length === 0) return;

//     const last = moveHistory[moveHistory.length - 1];

//     if (last.type === "place") {
//         undoMove();
//     } else if (last.type === "drag") {
//         dragUndo();
//     }
// }

// function redoMove() {
//     if(!lastMove) return;


//     const redoLabel = lastMove.label;
//     const redoPlayer = lastMove.player;
//     const redoIndex = lastMove.index;

//     const playerPlace = redoPlayer === "player1" ? player1place : player2place;
//      const cornerElement = document.getElementById(`${redoLabel}${redoIndex}`);

//      if (redoPlayer === "player1") {
//         player1Coins++;
//         player1place[redoLabel].push(redoIndex);
//     } else {
//         player2Coins++;
//         player2place[redoLabel].push(redoIndex);
//     }

//     addEdgeOwnership(redoLabel, playerPlace, redoPlayer, redoIndex);

//     if (cornerElement) {
//         if(redoPlayer === "player1"){
//             cornerElement.style.backgroundColor = "blue";
//             cornerElement.classList.add("Filled");}
//         else{
//             cornerElement.style.backgroundColor = "red";
//             cornerElement.classList.add("Filled");
//         }
//     }

    
//     updateHist();
//     currentPlayer = currentPlayer === 1 ? 2 : 1;
//     turnSeconds = 20;
//     player1Timer.innerText = "20";
//     document.getElementById('pturn').innerText = `Player ${currentPlayer} turn!`;

//     lastMove = null;
// }

// function dragRedo() {
//     if(moveHistory.length === 0) return;

//     // const lastMove = moveHistory.pop();
//     const dmPlayer = lastMove.player;
//     const from = lastMove.from;
//     const to = lastMove.to;

//     const playerPlace = dmPlayer === "player1" ? player1place : player2place;

//     const toCorner = document.getElementById(`${from.label}${from.index}`);
//     toCorner.style.backgroundColor = "transparent";
//     toCorner.classList.remove("Filled");

//     const fromCorner = document.getElementById(`${to.label}${to.index}`);
//     fromCorner.style.backgroundColor = (dmPlayer === "player1") ? "blue" : "red";
//     fromCorner.classList.add("Filled");

//     removeIndex(playerPlace[to.label], to.index);
//     playerPlace[from.label].push(from.index);

//     removeEdgeOwnership(to.label, playerPlace, dmPlayer, to.index);
//     addEdgeOwnership(from.label, playerPlace, dmPlayer, from.index);

//     currentPlayer = currentPlayer=== 1 ? 2 : 1;
//     document.getElementById('pturn').innerText = `Player ${currentPlayer} turn.`;
// }

// function removeEdgeOwnership(label, playerPlace, player){
//     const positions = playerPlace[label];
//     const edgeArr = edgeScores[label];
//     const ownership = ownedEdges[player][label];

//     for(let i=0; i<6; i++){
//         const a = i;
//         const b = (i+1)%6;

//         if((positions.includes(a) && positions.includes(b))){
//             if(!ownership[i]){
//                 ownership[i] = true;
//                if(player === 'Player1'){
//                 player1Score -= edgeArr[i];
//                 console.log(`Player 1 Score: ${player1Score}`);
//                 document.getElementById("p1Score").innerText = player1Score;
//                }
//                else{
//                 player2Score -= edgeArr[i];
//                 console.log(`Player 2 Score: ${player2Score}`);
//                 document.getElementById("p2Score").innerHTML = player2Score;
//                }
//             }
//         }
//         else if(ownership[i]){
//             ownership[i] = false;
//             if(player === 'Player1'){
//                 player1Score += edgeArr[i];
//                 console.log(`Player 1 Score: ${player1Score}`);
//                 document.getElementById("p1Score").innerText = player1Score;

//             }
//             else {
//                 player2Score += edgeArr[i];
//                 console.log(`Player 2 Score: ${player2Score}`);
//                 document.getElementById("p2Score").innerHTML = player2Score;
//             }
//         }
//     }
// }/

// function removeEdgeOwnership(label, playerPlace, player, index) {
//     const edgeArr = edgeScores[label];
//     const ownership = ownedEdges[player.toLowerCase()][label];
//     const positions = playerPlace[label];

//     const a = index;
//     const b1 = (index + 1) % 6;
//     const b2 = (index - 1 + 6) % 6;

//     // Check both possible edges created by placing at 'a'
//     if (positions.includes(b1) && ownership[a]) {
//         ownership[a] = false;
//         if (player === 'player1') {
//             player1Score -= edgeArr[a];
//             document.getElementById("p1Score").innerText = player1Score;
//         } else {
//             player2Score -= edgeArr[a];
//             document.getElementById("p2Score").innerText = player2Score;
//         }
//     }

//     if (positions.includes(b2) && ownership[b2]) {
//         ownership[b2] = false;
//         if (player === 'player1') {
//             player1Score -= edgeArr[b2];
//             document.getElementById("p1Score").innerText = player1Score;
//         } else {
//             player2Score -= edgeArr[b2];
//             document.getElementById("p2Score").innerText = player2Score;
//         }
//     }
// }

// function addEdgeOwnership(label, playerPlace, player, index) {
//     const edgeArr = edgeScores[label];
//     const ownership = ownedEdges[player.toLowerCase()][label];
//     const positions = playerPlace[label];

//     const a = index;
//     const b1 = (index + 1) % 6;
//     const b2 = (index - 1 + 6) % 6;

//     // Check both possible edges created by placing at 'a'
//     if (positions.includes(b1) && !ownership[a]) {
//         ownership[a] = true;
//         if (player === 'player1') {
//             player1Score += edgeArr[a];
//             document.getElementById("p1Score").innerText = player1Score;
//         } else {
//             player2Score += edgeArr[a];
//             document.getElementById("p2Score").innerText = player2Score;
//         }
//     }

//     if (positions.includes(b2) && !ownership[b2]) {
//         ownership[b2] = true;
//         if (player === 'player1') {
//             player1Score += edgeArr[b2];
//             document.getElementById("p1Score").innerText = player1Score;
//         } else {
//             player2Score += edgeArr[b2];
//             document.getElementById("p2Score").innerText = player2Score;
//         }
//     }
// }

function updateHist(){
hist.innerHTML = moveHistory.map((move, i) => {
    // return `Move ${i+1}: Player ${move.player} placed titan at ${move.label}[${move.index}]`;
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

const pauseBt = document.getElementById("pauseBt");
const resumeBt = document.getElementById("resumeBt");
const resetBt = document.getElementById("resetBt");
const undoBt = document.getElementById("undoBt");
const redoBt = document.getElementById("redoBt");

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
// undoBt.addEventListener('click', handleUndo);
// redoBt.addEventListener('click', () => {
//     redoMove();
//     dragRedo();
// });


// enableClick("outCorner", onClick);
dragTitans("mainCorner", dragClick);
dragTitans("outCorner", dragClick);
// dragTitans("inCorner", dragClick);


window.onload = function () {
    loadLeaderBoard();
};





