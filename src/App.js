// App - React component
//JS file, uses JSX elements (<button>) = JS + HTML tags combo
//-components use prop className to style through CSS file

//import useState to allow for component state management ("remembering a square was clicked")
import { useState } from 'react';


//Square - component function; defined to return single board square button (reusable component - avoids duplicated code)
//-uses props value passed from parent (Board) to determine state (empty/X/O)
//-uses function prop passed down from parent, called when square is clicked, to update parent on which square is clicked
//--=> child asks parent component to update state of board 
//-specialStyle prop used to highlight winning squares (set by Board - highlights square's background)
function Square({ value, onSquareClick, specialStyle }) {
    return (
        <button className="square" onClick={onSquareClick} style={specialStyle}> {value} </button>
    );
}
//----


//Board - component function defined to build TicTacToe board using Square components
//-parent component (Board) manages state of all Square components through passed props => lifted state from child to parent
//-Game component manages state of game (Board's parent) through passed props {xIsNext, squares, onPlay}
//-returns single JSX element, wrapped using Fragment (<>...</>)
function Board({ xIsNext, squares, onPlay }) {

    //---
    //handleClick() - function to handle click of Squares by updating squares array (state variable in Game) based on clicked square
    //-React re-renders Board when button is clicked, with new value 'X'/'O' displayed in clicked square
    function handleClick(i) {
        //check if square already has value (to avoid overwriting => return w/o update/changing turn) or if someone already won (game ended)
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        //otherwise, update empty square's value
        const nextSquares = squares.slice();        //creates copy of squares array (for immutable approach)
        //set value of square based on X/O turn
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }

        //call Game's onPlay function, passing it new updated squares array - Game component updates Board on user click + keeps history
        //-onPlay also takes updated square id (i) to track (row,col) specific move history
        onPlay(nextSquares, i);            //React re-render board + update X/O turn (flip boolean)
    }
    //passed to child as new arrow function defined to call specific handleClick w/ param (to avoid immediate call => infinite render) 


    //---
    //determine winner of game + display whose turn it is/who won
    const winner = calculateWinner(squares);        //winner = {winningPlayer, winningSquares}, or null
    let status;
    let statusSpecialStyle;       //-special style of status based on win or draw (for extra visual clue)
    if (winner) {
        status = "Winner: " + winner.winningPlayer + "!";
        statusSpecialStyle = "status-win";
    } else {
        //if no winner yet, check if board is full (no more empty spaces)
        if (!squares.includes(null)) {
            status = "No more moves! It's a Draw!"
            statusSpecialStyle = "status-draw";
        }
        //no winner yet, but board is not full => next turn
        else {
            status = "Next player: " + (xIsNext ? "X" : "O");
        }
    }

    
    //---
    //create Board layout using loops to make squares (instead of hardcoding)
    //-when created in loop, each item needs a key (=>sqVal calculation below)
    function buildBoard() {
        let tempBoard = [];
        //loop for each row in board
        for (let rowI = 0; rowI < 3; rowI++) {
            let tempBoardRow = [];
            //loop for each square in a row
            for (let colJ = 0; colJ < 3; colJ++) {
                let sqVal = (rowI * 3) + colJ;      //key, value, and onClick (matches square arr index)
                //check if winner => if so, highlight winning squares (based on val) (otherwise, null if not winning square or no winner yet)
                let sqWin = winner ? (winner.winningSquares.includes(sqVal) ? {background:"#f9ff45"} : null) : null;
                tempBoardRow.push( <Square key={sqVal} value={squares[sqVal]} onSquareClick={() => handleClick(sqVal)} specialStyle={sqWin} /> );
            }
            tempBoard.push( <div key={rowI} className="board-row"> {tempBoardRow} </div> );
        }
        return tempBoard;
    }
    //-also used for board when re-rendering

    const boardSquaresLayout = buildBoard();

    //---
    //component return
    return (
    <>
        <div className={"status " + statusSpecialStyle} > {status} </div>
        { boardSquaresLayout }
    </>
    );
}
//----

//Game - top-level component to manage game (including history of moves)
//-controls Board (lifted-up state); updates squares + keeps history, and manages X/O turns 
//main function of file (default) accessible outside file (exported)
export default function Game() {
    
    //history - state variable array of game's past moves (array of arrays - each turn's squares array)
    const [history, setHistory] = useState( [Array(9).fill(null)] );
    //currentMove - state variable tracking which step (move) the user is currently viewing
    const [currentMove, setCurrentMove] = useState(0); 
    //isAscendingOrder - state variable toggles if (list) moves are sorted in ascending or descending order (tracks display state)
    const [isAscendingOrder, setAscendingOrder] = useState(true);
    //movesCoordinates - state variable array of (row,col) moves history (order of user-clicked plays)
    const [movesCoordinates, setMovesCoordinates] = useState(Array(9).fill(""));
    //---
    //xIsNext - boolean var to track X/O turn - first move is 'X' by default (move #0), so X turn on every even move - NOT state var (avoids redundant state)
    const xIsNext = (currentMove % 2 == 0);
    //currentSquares - array of squares displayed for the current move (based on *viewed* move, not nec. last squares array in history) - NOT state var
    const currentSquares = history[currentMove];


    //---
    //handlePlay() - function to update the game; updates squares array (like Board's old setSquares() - re-render) + flips X/O turn 
    //-passed down to Board component as props
    //-receives nextSquares (updated board array) from Board call
    //-receives clickedSquare (id of square clicked for move) from Board call
    function handlePlay(nextSquares, clickedSquare) {
        //update history state variable w/ new squares array
        //only keep history up until currentMove's view (in case jumped back to previous move and changed play)
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];  //creates new array containing all items in history up to currentMove + appends nextSquares (spread syntax)
        setHistory(nextHistory);    
        //update currentMove state variable to next value from *new* history (in case jumped back and changed)
        setCurrentMove(nextHistory.length - 1);
        //above updates X/O-next-turn variable based on currentMove value

        //add move coordinates to history list based on clicked square's id
        let moveRow = Math.floor(clickedSquare / 3);     //int division (floored) of move # by 3 gives row number
        let moveCol = clickedSquare % 3;                 //mod (remainder) of move # by 3 gives column number
        let newMoveCoordinates = "(" + moveRow + "," + moveCol + ")";
        const newCoordinatesArr = [...movesCoordinates.slice(0, currentMove + 1), newMoveCoordinates];
        //update state variable to new coordinates history array (in case jumped back and changed) 
        setMovesCoordinates(newCoordinatesArr);
    }

    //---
    //jumpTo() - function to jump to (previous) moves in game history - done by updating currentMove state variable
    function jumpTo(nextMove) {
        //update currentMove state variable to update move currently viewed (re-render)
        setCurrentMove(nextMove);
        //X/O-turn updated based on currentMove value - since X always first ('next' on move 0), then X is next turn on every even currentMove
    }
    
    //---
    //toggleAscendingOrder() - function to switch from ascending/descending order of moves (list)
    function toggleAscendingOrder() {
        //update isAscendingOrder state variable to opposite state (=> re-render)
        setAscendingOrder(!isAscendingOrder);
    }

    //---
    //moves - maps game moves (history) to list of buttons (per move), allowing to jump to past moves
    //--squares = mapped to an array element in history; move = mapped to array index in history
    const moves = history.map( (squares, move) => {
        //display description for button's move -include moves location (row,col) format
        let description;
        if (move > 0) {
            description = "Go to move #" + move + " - Played: " + movesCoordinates[move];
        } else {
            description = "Go to game start";
        }

        //build listed move (component as seen in moves list)
        //-default -> not current move - return button w/ onClick to jump to move
        let listedMove = (<button onClick={() => jumpTo(move)}> {description} </button>);

        //for current move only, display "You are at move #.." instead of a button
        if (move == currentMove) {          //current move - return text, no button
            let currentMoveDescription;
            if (move == 0) {     //jumped back to start of game - no move played (will print undefined if uses movesCoordinates[move])
                currentMoveDescription = "You are at move #" + move + " - Game start";
            } else {           //current move # listed as text, with coordinate for move played
                currentMoveDescription ="You are at move #" + move + " - Played: " + movesCoordinates[move];
            }
            //alt: let currentMoveDescription = "You are at move #" + move + ( (move == 0) ? " - Game start" : (" - Played: " + movesCoordinates[move])  );
            listedMove = (<div> <b> {currentMoveDescription} </b> </div>);
        }

        //return listed button element w/ jump onclick handler (w/ unique key property for each child in React list = move's unique sequence no.)
        //--moves will never be re-ordered, deleted, or inserted in middle => safe to use move index as key
        return (
            <li key={move}>
                {/* <button onClick={() => jumpTo(move)}> {description} </button> */}
                {listedMove}
            </li>
       );
    }
    );
    //onClick function passed as new arrow function defined to call specific jumpTo w/ param (to avoid immediate call => infinite render from state update)


    //---
    //component return - game board, and game info (history) = array list of React button elements (to jump to past moves)
    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>

            <div className="game-info">

                <div className="game-moves-order">
                    <button onClick={() => toggleAscendingOrder()}> Sort moves in {isAscendingOrder ? "Descending" : "Ascending"} Order </button>
                    <h6> Current Display: {isAscendingOrder ? "Ascending" : "Descending"} </h6>
                </div>

                {/* display moves list based on ascending/descending order selection */}
                <ol> {isAscendingOrder ? moves : moves.reverse()} </ol>
            </div>
        </div>
    );
} 


//----
//calculateWinner() - helper function to check for winner of TicTacToe
//-called by Board; passed current-viewed squares array
//-returns winning player [X, O, or null], and if winner found also returns winning squares (index array)
function calculateWinner(squares) {
    //winning combos possible (horizontal, vertical, + diagonal)
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    //check if a winning combo line has been populated by a player (cell has value + cell's values all match)
    for (let i = 0; i < winningLines.length; i++) {
        const [a, b, c] = winningLines[i];     //copy indices in a winning combo
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            //return winning player, and squares line (index) they won with
            return {
                winningPlayer: squares[a],
                winningSquares: winningLines[i]
            };
        }
    }
    //otherwise, return null
    return null;
} 
