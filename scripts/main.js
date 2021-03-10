const board = (() => {
    let boardValues =[
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    let tilesMarked = 0;

    function _won() {
        // check rows
        let sum = 0;
        for(let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                sum += boardValues[i][j];
            }
            if (sum == 3 || sum == -3) {
                return true;
            }
            sum = 0;
        }

        // check cols
        for(let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                sum += boardValues[j][i];
            }
            if (sum == 3 || sum == -3) {
                return true;
            }
            sum = 0;
        }

        // diagonal
        sum = boardValues[0][0] + boardValues[1][1] + boardValues[2][2];
        if (sum == 3 || sum == -3) {
            return true;
        }

        // other diagonal
        sum = boardValues[0][2] + boardValues[1][1] + boardValues[2][0];
        if (sum == 3 || sum == -3) {
            return true;
        }



        return false;
    }

    function tileAvailable(row, col) {
        return boardValues[row][col] == 0;
    }

    let placeMarker = (e) => {
        console.table(boardValues);
        let pos = e.target.dataset.pos.split(" ");
        if (tileAvailable(pos[0],[pos[1]]) == true) {
            tilesMarked++;
            e.target.textContent = Game.getCurrentPlayerMarker();
            boardValues[pos[0]][pos[1]] = Game.getCurrentPlayerValue();
            if(_won()) {
                alert(`${Game.getCurrentPlayerName()} wins!`);
                resetBoard();
            }
            else {
                if (tilesMarked == 9) {
                    alert("Tie!");
                    resetBoard();
                }
                else 
                    Game.endTurn();
            }
        }
        else {
            console.log("position is already used " + `${pos[0]} ${pos[1]}`);
        }
    }

    function aiPlaceMarker(row, col) {
        tilesMarked++;
        boardValues[+row][+col] = Game.getCurrentPlayerValue();

        let tiles = document.querySelectorAll('.tile');
        for (let i = 0; i < tiles.length; i++) {
            if(tiles[i].getAttribute("data-pos") != null) {
                if (tiles[i].dataset.pos == `${row} ${col}`) {
                    tiles[i].textContent = Game.getCurrentPlayerMarker();
                    break;
                }
            }
        }

        if(_won()) {
            alert(`${Game.getCurrentPlayerName()} wins!`);
            resetBoard();
        }
        else {
            if (tilesMarked == 9) {
                alert("Tie!");
                resetBoard();
            }
            else {
               Game.endTurn();
         }
        }
    }

    let createBoard = () => {
        let boardElement = document.getElementById("board");
        let btn = document.createElement("button");
        btn.classList.add("tile");
        btn.textContent = " ";
        for(let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                btn = btn.cloneNode(true);
                btn.dataset.pos = `${i} ${j}`;
                btn.addEventListener('click', placeMarker);
                boardElement.appendChild(btn);
            }
        }
    }

    let resetBoard = () => {
        boardValues =[
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        tilesMarked = 0;

        let tiles = document.querySelectorAll(".tile");
        for (ind in tiles) {
            tiles[ind].textContent = "";
        }

        console.log(Game.getPlayerIsCPU());
        if(Game.getPlayerIsCPU()) {
            Game.endTurn();
        }
    }

    return {createBoard, resetBoard, tileAvailable, aiPlaceMarker};
})();

const Player = (aname, amarker, aisCPU) => {
    let name = aname;
    let marker = amarker;
    let isCPU = aisCPU;
    const getName = () => name;
    const getMarker= () => marker;
    const getIsCPU = () => isCPU;
    return {getName, getMarker, getIsCPU};
}

const Game = (() =>  {
    let player1;
    let player2;
    let movesFirst = 0;
    
    let gameMode = document.getElementById("game-mode");

    let _decideOrder = () => {
        let flip = Math.floor(Math.random() * 100);
        if (flip < 50) {
            alert(`Player 1: ${player1.getName()}: X\nPlayer 2: ${player2.getName()}: O\n\nPlayer 1 goes first!`);
            movesFirst = 0;
            _changeTurnNameElement(player1.getName());
            if(player1.getIsCPU()) {
                _AITakeTurn();
            }
        }
        else {
            alert(`Player 1: ${player1.getName()}: X\nPlayer 2: ${player2.getName()}: 0\n\nPlayer 2 goes first!`);
            movesFirst = 1;
            _changeTurnNameElement(player2.getName());
            if(player2.getIsCPU()) {
                _AITakeTurn();
            }
        }
    }

    function _changeTurnNameElement(theName) {
        document.getElementById("turn").textContent = theName;
    }

    let _promptPlayerName = (playerNumber) => {
        let pName = prompt(`What is Player ${playerNumber}'s name?`, "John Doe");
        if (pName === null) {
            pName = "John Doe";
        }
        return pName;
    }

    let startGame = () => {
        if (gameMode.value == "pvp") {
            player1 = Player(_promptPlayerName(1), "X", false);
            player2 = Player(_promptPlayerName(2), "O", false);
        }
        else {
            player1 = Player(_promptPlayerName(1), "X", false);
            player2 = Player("CPU1", "O", true);
        }

        board.resetBoard();
        _decideOrder();
    }

    let defaultGame = () => {
        player1 = Player("Player1", "X", false);
        player2 = Player("Player2", "O", false);
        movesFirst = 0;
        _changeTurnNameElement(player1.getName());
    }

    let getCurrentPlayerValue = () => {
        if (movesFirst == 0) {
            return 1;
        }
        else {
            return -1;
        }
    }

    let getCurrentPlayerMarker = () => {
        if (movesFirst == 0) {
            return player1.getMarker();
        }
        else {
            return player2.getMarker();
        }
    }

    let getCurrentPlayerName = () => {
        if (movesFirst == 0) {
            return player1.getName();
        }
        else {
            return player2.getName();
        }
    }

    let getPlayerIsCPU = () => {
        if (movesFirst == 0) {
            return player1.getIsCPU();
        }
        else {
            return player2.getIsCPU();
        }
    }

    function _AITakeTurn() {
        console.log("AI took turn");
        let rowChosen = Math.floor(Math.random() * 3);
        let colChosen = Math.floor(Math.random() * 3);
        while(!board.tileAvailable(rowChosen, colChosen)) {
            rowChosen = Math.floor(Math.random() * 3);
            colChosen = Math.floor(Math.random() * 3);
        }
        board.aiPlaceMarker(rowChosen, colChosen);
    }

    let endTurn = () => {
        if(movesFirst == 0) {
            movesFirst = 1;
            _changeTurnNameElement(player2.getName());
            console.log("player 2 is cpu: " + player2.getIsCPU());
            if(player2.getIsCPU()) {
                _AITakeTurn();
            }
        }
        else {
            movesFirst = 0;
            _changeTurnNameElement(player1.getName());
            console.log("player 1 is cpu: " + player1.getIsCPU());
            if(player1.getIsCPU()) {
                _AITakeTurn();
            }
        }
    }
    return {startGame, defaultGame, getCurrentPlayerValue, getCurrentPlayerName, getCurrentPlayerMarker, endTurn, getPlayerIsCPU};

})();

board.createBoard();
Game.defaultGame();